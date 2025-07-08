require 'json'
require 'set'

def readlist fn, res = nil
	res = Hash.new(nil) unless res
	f = File.open(fn, 'r:utf-8')
	f.each { |s|
		s.chomp!
		next if s == ''
		next if s[0] == '#'

		yield res, s.split(/\t/)
	}
	f.close
	res
end

$aglfn = Hash.new(false)
f = File.open('aglfn.txt', 'r:utf-8')
f.each { |s|
	s.chomp!
	next if s == ''
	next if s[0] == '#'

	uni, name, d = s.split(/;/, 3)
	$aglfn[uni.to_i(16)] = name
}
f.close

GlyphInfo = Struct.new(:name, :seq, :width, :note, :vert, :full) do
	def sort_val
		sprintf('%06X', seq.ord)
	end

	def to_json(*_args)
		h = { c: seq, w: width }
		h[:n] = note if note
		h[:v] = vert if vert
		h[:f] = full if full
		h.to_json
	end
end

$glist = {}
$klist = Set.new
#$cmap = Hash.new(nil)
$fulls = Set.new()

def to_glist src, is_kanji = false, skip_seen = false
	list = []
	src.each { |c, v|
		uni = c.ord

		if uni && is_kanji		# 漢字
			next if skip_seen && $klist === c	# 既に見た漢字はスキップ
			$klist << c

			gname = sprintf(uni <= 0xffff ? 'uni%04X' : 'u%05X', uni)
			$glist[gname] = GlyphInfo.new(gname, c, 'F')
			list << gname
			
			#$cmap[seq] = gname
			#list[no] = gname
		elsif uni					# 符號
			next if [0x20, 0x2c9, 0x3000, 0xA0, 0x2002].include?(uni)	# 空格、全形空格、半形空格
			gname = $aglfn[uni] || sprintf(uni <= 0xffff ? 'uni%04X' : 'u%05X', uni)
			next if $fulls.include?(gname)
			$glist[gname] = GlyphInfo.new(gname, c, v.width, v.note)
			#$cmap[c] = gname
			list << gname

			if v.full.length == 4
				$fulls << $glist[gname].full = sprintf('uni%04X', v.full.to_i(16))
				$glist[gname].note.gsub!(/半角/, '') if $glist[gname].note
			end

			if v.vert == 'V'
				vgname = gname + '.vert'
				$glist[vgname] = GlyphInfo.new(vgname, c, v.width, v.note+' (縦組み用)', gname)
				list << vgname
			end
		end
	}
	list
end

kyoiku = readlist('kyoiku.txt') { |r, t| r[t[0]] = t[2] }
joyo = readlist('joyokanji.txt') { |r, t| r[t[0]] = t[1] }
jis = readlist('jis-lv1.txt') { |r, t| r[t[0]] = '1' }
jis = readlist('jis-lv2.txt', jis) { |r, t| r[t[0]] = '2' }
kanken = readlist('kanken.txt') { |r, t| r[t[0]] = t[2] }

SymbolInfo = Struct.new(:c, :group, :width, :vert, :full, :note)
symbols = readlist('jsymbols.txt') { |r, t| r[t[1]] = SymbolInfo.new(t[1], t[0][1..-1], t[2], t[3], t[4], t[5]) }

result_tmp = {
	#'基礎字' => baselist,
	'半角記号' => to_glist(symbols.select { |c, v| v.group == '半角記号' }),
	'ひらがな・カタカナ' => to_glist(symbols.select { |c, v| v.group == 'ひらがな・カタカナ' }),
	'基本記号' => to_glist(symbols.select { |c, v| v.group == '基本記号' }),
	'教育漢字（1年）' => to_glist(kyoiku.select { |c, t| t == '1' }, true, true),
	'教育漢字（2年）' => to_glist(kyoiku.select { |c, t| t == '2' }, true, true),
	'教育漢字（3年）' => to_glist(kyoiku.select { |c, t| t == '3' }, true, true),
	'教育漢字（4年）' => to_glist(kyoiku.select { |c, t| t == '4' }, true, true),
	'教育漢字（5年）' => to_glist(kyoiku.select { |c, t| t == '5' }, true, true),
	'教育漢字（6年）' => to_glist(kyoiku.select { |c, t| t == '6' }, true, true),

	'漢検漢字（4級まで）' => to_glist(kanken.select { |c, t| t =~ /^LV(10|[4-9])$/ }, true, true),
	'漢検漢字（3級）' => to_glist(kanken.select { |c, t| t =~ /^LV3$/ }, true, true),
	'漢検漢字（準2級）' => to_glist(kanken.select { |c, t| t =~ /^LV2J$/ }, true, true),

	'その他の常用漢字' => to_glist(kanken.select { |c, t| t =~ /^LV2$/ }, true, true),
	'JIS第一水準' => to_glist(jis.select { |c, t| t == '1' }, true, true),
	'JIS第二水準' => to_glist(jis.select { |c, t| t == '2' }, true, true),
	'漢検漢字（1級まで）' => to_glist(kanken.select { |c, t| t =~ /^LV1J?$/ }, true, true),

	'その他の記号' => to_glist(symbols.select { |c, v| v.group == 'その他の記号' }),
	'ギリシャ・キリル文字' => to_glist(symbols.select { |c, v| v.group == 'ギリシャ・キリル文字' }),
	'機種依存文字' => to_glist(symbols.select { |c, v| v.group == '機種依存文字' }),
}

$glist = $glist.sort_by { |k, v| v.sort_val }.to_h

#result_tmp['基礎字'] |= result_tmp['基本包-漢字'].shift(100)

pagesize = 420
result = {}
result_tmp.each { |k, v|
	puts "Processing #{k} with #{v.size} items"
	puts "  -- #{(v.size * 1.0 / pagesize).ceil} pages with #{v.size % pagesize} items in last page" if v.size > pagesize

	next if v.size == 0
	if v.size > pagesize
		(v.size / pagesize.to_f).ceil.times { |i|
			result["#{k}##{i+1}"] = v[i * pagesize, pagesize]
		}
	else
		result[k] = v
	end
}

f = File.open('jglyphlist.js', 'w:utf-8')
f.puts "const glyphMap = #{JSON.pretty_generate($glist)};"
#f.puts "const glyphList = #{JSON.pretty_generate(result)};"
#f.puts "const glyphMap = #{$glist.to_json};"
f.puts "const glyphList = #{result.to_json};"
f.close
