//console.log("Hello Golden");

$(document).ready(function(){
	$('.delete-aticle').on('click', function(e){
		$target = $(e.target);
		//console.log($target.attr('data-id'));
		const id = $target.attr('data-id');
		$.ajax({
			type:'DELETE',
			url: '/article/'+id,
			success: function(response){
				alert('Deleting Article');
				//console.log('Article Deleted');
				window.location.href='/';
			},
			error: function(err){
				console.log(err);
			} 

		});
	});
});