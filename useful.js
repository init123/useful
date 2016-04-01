
// 被整除的选择器
$('#u-cate-main>dl>dd>h2:nth-child(3n)');

// 没有被选中
$('.j-cate-s').not(':checked');

// 所有不为空的 input 元素
$("input:not(:empty)");

// 包含 W3C字符串的所有p元素
$("p:contains('W3C')");

// 所有隐藏的 <p> 元素
$("p:hidden");

// 可以使用函数
$('.j-chk').prop('value', function(i, val){
	if($(this).val() == 02){
		$(this).prop('checked', false);
	}
	console.log($(this).val(), i, val);
});