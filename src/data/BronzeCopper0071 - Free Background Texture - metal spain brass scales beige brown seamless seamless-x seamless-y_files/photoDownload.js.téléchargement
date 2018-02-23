var hidden=0,download_drop=0,preview=0;var adsRightRandomType=1;$("#hide").click(function(){if(hidden==0&&$("#categories").css("margin-left")=="0px"){$("#categories_text").animate({'margin-left':'-204px'},300)
$("#categories").animate({'margin-left':'-234px'},300)
setTimeout(function(){$("#hide").attr("style",'background-image: url(../images/show.png)')
hidden=1;},150);}
if(hidden==1&&$("#categories").css("margin-left")=="-234px"){$("#categories_text").animate({'margin-left':'0px'},300)
$("#categories").animate({'margin-left':'0px'},300)
setTimeout(function(){$("#hide").attr("style",'background-image: url(../images/hide.png)')
hidden=0;},150);$(".textures_ovr").css("margin-bottom","98px");}
var skyScraperWidth=$("#ads_right_skyscraper").width()+ 34;var windowWidth=$(window).width();if($(window).width()<1024){windowWidth=1024}
if($("#categories").css("margin-left")=="0px"){$("#download_images_content").width(windowWidth- skyScraperWidth);}
if($("#categories").css("margin-left")=="-234px"){$("#download_images_content").width(windowWidth- 234- skyScraperWidth);}})
$(document).ready(function(){var isUserPremium=userAccountType&&userAccountType==="PREMIUM"?true:false;if(isUserPremium===false){if($(window).width()>=1600){adsRightRandomType=Math.floor((Math.random()*10));var adsSkyScraperDiv=$('#ads_right_skyscraper');try{if(adsRightRandomType%2==0){var adSkyScraperCode=''+'<!-- Textures.com - Download page Large Skyscraper 300x600-->'+'<ins class="adsbygoogle"'+'	style="display:inline-block;width:300px;height:600px"'+' 	data-ad-client="ca-pub-4290181414143312"'+'	data-ad-slot="4614370004"></ins>'+'<script>'+'	(adsbygoogle = window.adsbygoogle || []).push({});'+'</script>';}else{var adSkyScraperCode=''+'<!-- Textures.com - Download page Small Skyscraper 160x600-->'+'<ins class="adsbygoogle"'+'	style="display:inline-block;width:160px;height:600px"'+' 	data-ad-client="ca-pub-4290181414143312"'+'	data-ad-slot="9044569609"></ins>'+'<script>'+'	(adsbygoogle = window.adsbygoogle || []).push({});'+'</script>';}
adsSkyScraperDiv.html(adSkyScraperCode);}
catch(e){console.log("Failed to insert Skyscraper ads "+ JSON.stringify(e));}}
var adsFooterDiv=$('#ads_download_footer');try{var adFooterCode=''+'<!-- Textures.com - Download page Leaderboard Bottom-->'+'<ins class="adsbygoogle"'+'	style="display:inline-block;width:728px;height:90px"'+' 	data-ad-client="ca-pub-4290181414143312"'+'	data-ad-slot="3916366000"></ins>'+'<script>'+'	(adsbygoogle = window.adsbygoogle || []).push({});'+'</script>';adsFooterDiv.html(adFooterCode);}
catch(e){console.log("Failed to insert download footer ads "+ JSON.stringify(e));}}});$(document).ready(function(){$('.size-cannot-be-downloaded').click(function(){alert("All images with given size exceeds quota. Download was not successful.");});initializeDownloadLinkHover();});$(".download_drop_down, .buttons .download").click(function(e){e.stopPropagation();});$(".buttons .download").click(function(e){if(download_drop==0){$(".download_drop_down").fadeIn(100);download_drop=1;}
else{$(".download_drop_down").fadeOut(100);download_drop=0;}});$(document).click(function(){if(download_drop==1){$(".download_drop_down").fadeOut(100);download_drop=0;}})
function smllscr(){var skyScraperWidth=$("#ads_right_skyscraper").width()+ 34;var windowWidth=$(window).width();if($(window).width()<1024){windowWidth=1024}
if($("#categories").css("margin-left")=="0px"){$("#download_images_content").width(windowWidth- 234- skyScraperWidth);}
if($("#categories").css("margin-left")=="-234px"){$("#download_images_content").width(windowWidth- skyScraperWidth);}
if($(".textures_ovr").height()<1000+ $(".header-image").height()){$("#downloadKeywords").width($("#download_images_content").width());}else{$("#downloadKeywords").width($(".content_padding").width());}
if($(window).width()<=1300){$(".navigation ul li a").attr("style","padding: 0 14px;")
$(".news").height(185)}
else{$(".navigation ul li a").attr("style","padding: 0 18px;")}}
window.onresize=smllscr;function updateAddToLightboxText(idsToUpdate){for(var i=0;i<idsToUpdate.length;i++){var photoId=idsToUpdate[i];var targetIcon=$('#addToLightboxIcon-'+ photoId);targetIcon.attr("src","/images/favorites-plus.png");targetIcon.parents('form').addClass('removeLightboxForm').removeClass('addToLightboxForm');}}
function updateRemoveFromLightboxText(form){var targetIcon=form.children('.download_favourites_icon');targetIcon.attr("src","/images/favorites-min.png");form.addClass('addToLightboxForm').removeClass('removeLightboxForm');}
$(document).ready(function(){var skyScraperWidth=$("#ads_right_skyscraper").width()+ 34;var windowWidth=$(window).width();if($(window).width()<1024){windowWidth=1024}
if($("#categories").css("margin-left")=="0px"){$("#download_images_content").width(windowWidth- 234- skyScraperWidth);}
if($("#categories").css("margin-left")=="-234px"){$("#download_images_content").width(windowWidth- skyScraperWidth);}
$(".textures_ovr").css("min-height","800px");smllscr();$('.download-whole-set-premium').click(function(){window.location='/premiumaccess';return false;});$(document).on('click','.removeLightboxForm',function(){var form=$(this);submitRemoveLightboxForm(form);});$(document).on('click','.addToLightboxForm',function(){var form=$(this);submitAddToLightboxForm(form);});function submitAddToLightboxForm(form){$(form).ajaxSubmit({dataType:'json',url:'/lightbox/addToLightbox',success:function(response){updateLightboxCounter();if(response.idsAdded){updateAddToLightboxText(response.idsAdded);}}});return false;}
function submitRemoveLightboxForm(form){$(form).ajaxSubmit({dataType:'json',url:'/lightbox/removeFromLightbox',success:function(response){updateLightboxCounter();if(response.id){updateRemoveFromLightboxText(form);}}});return false;}
$('#addAllToLightboxForm').submit(function(){$(this).ajaxSubmit({dataType:'json',url:'/lightbox/addToLightbox',success:function(response){updateLightboxCounter();if(response.idsAdded){updateAddToLightboxText(response.idsAdded);}}});return false;});$('#addAllToLightbox').click(function(){$('#addAllToLightboxForm').submit();});var headers=$('.dots').length;window.tindex=0;window.intervalCount=0;function changeHeader(i){return function(){if($('.dots').eq(i).hasClass("active_dot")){return;}
$(".active_t").fadeOut(300);$(".download_headers_image").eq(i).fadeIn(300);$(".download_headers_image").removeClass("active_t");$(".dots").removeClass("active_dot");$(".download_headers_image").eq(i).addClass("active_t");$('.dots').eq(i).addClass("active_dot");}}
function headerTicker(){if(window.tindex==headers- 1){window.tindex=0;index=0;}else{window.tindex=window.tindex+ 1;index=window.tindex;}
$('.dots').eq(index).trigger('click');}
for(var i=0;i<headers;i++){$('.dots').eq(i).click(changeHeader(i));}
function repeatOften(){if(window.intervalCount>=180){headerTicker();window.intervalCount=0;}else{window.intervalCount++;}
return requestAnimationFrame(repeatOften);}
window.intervalId=requestAnimationFrame(repeatOften);});