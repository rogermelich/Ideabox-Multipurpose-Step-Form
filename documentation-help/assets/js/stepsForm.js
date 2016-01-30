(function(jQuery){

	$.fn.stepsForm = function(settings){
			var defaults={
					width			:'100%',
					active			:0,
					errormsg		:'Check faulty fields.',
					sendbtntext		:'Create Account',
					posturl			:'demo_steps_form.php',
					posterrormsg	:'Form post error.',
					postsuccessmsg	:'Congragilations! Form post successfly!',
					theme			:'default',
				};
			var settings=$.extend(defaults,settings);
			
			return this.each(function(){
				var modul=$(this);
				var count=modul.find(".sf-steps-content").find("div").length;
				var nextbtntext=modul.find("#sf-next").text();
				var confirmval=new Array();
				var confirmobject=new Array();
				
				//ilk yapılacaklar-----------------------------------
				modul.css({"width":settings.width});
				modul.addClass("sf-theme-"+settings.theme);
				openActiveTab();
				modul.find(':input').click(function (){
					$(this).removeClass("sf-error");
				});				
				
				//steps click events---------------------------------
				modul.find(".sf-steps-content>div").click(function(e) {
					if ($(this).attr("class")!="sf-active")
					{
						if (settings.active>$(this).index())
						{
							settings.active=$(this).index();
							openActiveTab();
						}
						else
						{
							//eğer daha sonraki bir taba tıkladıysa önceki tabların hepsi kontrol yapılıp yönlendirilecek
							//ya da aktif olmadan yeni tablara geçilmeyecek. bu seferde aktifolduktan sonra değiştirebilir.
							geriControl($(this).index());
						}
					}
                });
				
				//next click event ----------------------------------
				modul.find("#sf-next").click(function(e) {
					//devam etmesi için önce validate ler kontrol edilecek
					requredcontrol=false;
					modul.find(".sf-steps-form>ul").eq(settings.active).find(':input').each(function (){
						if ($(this).attr("data-required")=="true" && $(this).val()=="")
						{
							$(this).addClass("sf-error");
							requredcontrol=true;
						}
						else if($(this).val()!="")
						{						
							if ($(this).attr("data-email")=="true" && validateEmail($(this).val())==false)
							{
								$(this).addClass("sf-error");
								requredcontrol=true;
							}
							
							if ($(this).attr("data-number")=="true" && isNaN($(this).val()))
							{
								$(this).addClass("sf-error");
								requredcontrol=true;
							}
							
							if ($(this).attr("data-confirm")=="true")
							{
								confirmval.push($(this).val());
								confirmobject.push($(this));
								//$(this).addClass("sf-error");
								confirmvalControl();
							}
							
						}
					});
					confirmobjectControl();
					confirmval.length=0;
					
					
					if (!requredcontrol)
					{
						confirmobjectControlDelete();
						confirmobject.length=0;
						if (modul.find("#sf-next").text()==settings.sendbtntext)
						{
							modul.find("#sf-msg").text("");
							event.preventDefault();
							$.ajax({
								type: "POST",
								url: settings.posturl,
								data: modul.find("form:first").serialize()
							})
							.done(function( msg ) {
								if (msg==true)
								{
									modul.find("#sf-msg").removeClass().addClass(".sf-msg-success").text(settings.postsuccessmsg);	
									modul.find("form")[0].reset();
								}
									
								else
									modul.find("#sf-msg").removeClass().addClass(".sf-msg-error").text(settings.posterrorsmsg);	
									
							});							
						}
						else
						{					
							settings.active++;
							if (settings.active>count-1)
							{
								settings.active--;
								modul.find("#sf-msg").text("");
							}
							else
							{
								openActiveTab();
								requredcontrol=false;
								modul.find("#sf-msg").text("");
							}
						}
					}
					else
					{
						modul.find("#sf-msg").html(settings.errormsg);
					}
					
                });
				
				//previous click event ------------------------------
				modul.find("#sf-prev").click(function(e) {
					settings.active--;
					if (settings.active<0)
					{
						settings.active++;
					}
					else
					{
						openActiveTab();
						requredcontrol=false;
					}
				});
				
				function geriControl(sayac)
				{
					requredcontrol=false;
					for (i=0; i<sayac; i++)
					{
						modul.find(".sf-steps-form>ul").eq(i).find(':input').each(function (){
							if ($(this).attr("data-required")=="true" && $(this).val()=="")
							{
								$(this).addClass("sf-error");
								requredcontrol=true;
							}
							else if($(this).val()!="")
							{						
								if ($(this).attr("data-email")=="true" && validateEmail($(this).val())==false)
								{
									$(this).addClass("sf-error");
									requredcontrol=true;
								}
								
								if ($(this).attr("data-number")=="true" && isNaN($(this).val()))
								{
									$(this).addClass("sf-error");
									requredcontrol=true;
								}
								
								if ($(this).attr("data-confirm")=="true")
								{
									confirmval.push($(this).val());
									confirmobject.push($(this));
									//$(this).addClass("sf-error");
									confirmvalControl();
								}
							}
						});
					}
					
					confirmobjectControl();
					confirmval.length=0;
					
					if (!requredcontrol)
					{
						confirmobjectControlDelete();
						confirmobject.length=0;
						settings.active=sayac;
						if (settings.active>count-1)
						{
							settings.active--;
							modul.find("#sf-msg").text("");
						}
						else
						{
							openActiveTab();
							requredcontrol=false;
							modul.find("#sf-msg").text("");
						}
					}
					else
					{
						modul.find("#sf-msg").html(settings.errormsg);
					}
				}
				
				resizeEvent();
				$(window).resize(function(e) {
                    resizeEvent();
                });
				
				//resize event func-----------------------------------
				function resizeEvent()
				{
					if (modul.width()>500)
					{
						modul.find(".column_1").css({"width":"16.666666667%","margin-bottom":"0px"});
						modul.find(".column_2").css({"width":"33.333333334%","margin-bottom":"0px"});
						modul.find(".column_3").css({"width":"50%","margin-bottom":"0px"});
						modul.find(".column_4").css({"width":"66.666666667%","margin-bottom":"0px"});
						modul.find(".column_5").css({"width":"83.333333334%","margin-bottom":"0px"});
						modul.find(".column_6").css({"width":"100%","margin-bottom":"0px"});
						modul.find(".sf-content>li").css({"margin-bottom":"2rem"});
						modul.find(".sf-steps-content").removeClass("sf-steps-center");
						modul.find(".sf-steps-navigation").removeClass("sf-align-center").addClass("sf-align-right");
					}
					else
					{
						modul.find(".column_1").css({"width":"100%","margin-bottom":"2rem"});
						modul.find(".column_2").css({"width":"100%","margin-bottom":"2rem"});
						modul.find(".column_3").css({"width":"100%","margin-bottom":"2rem"});
						modul.find(".column_4").css({"width":"100%","margin-bottom":"2rem"});
						modul.find(".column_5").css({"width":"100%","margin-bottom":"2rem"});
						modul.find(".column_6").css({"width":"100%","margin-bottom":"2rem"});
						modul.find(".sf-content>li").css({"margin-bottom":"0px"});
						modul.find(".sf-steps-content").addClass("sf-steps-center");
						modul.find(".sf-steps-navigation").removeClass("sf-align-right").addClass("sf-align-center");
					}
				}
				
				//open new step --------------------------------------
				function openActiveTab()
				{
					modul.find(".sf-steps-content>div").removeClass("sf-active");
					modul.find(".sf-steps-form>.sf-content").css({"display":"none"});
					modul.find(".sf-steps-form>ul").eq(settings.active).fadeIn();
					modul.find(".sf-steps-content>div").eq(settings.active).addClass("sf-active");
					if (settings.active==count-1)
						modul.find("#sf-next").text(settings.sendbtntext);
					else
						modul.find("#sf-next").text(nextbtntext);
					
					if (settings.active==0)
						modul.find("#sf-prev").css({"display":"none"});
					else
						modul.find("#sf-prev").css({"display":"inline-block"});
				}
				
				//other scripts --------------------------------------
				function validateEmail(email) {
					var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return re.test(email);
				}
				
				function confirmvalControl()
				{
					var firstval=confirmval[0];
					
					for (index = 0; index < confirmval.length; index++) {
						if (confirmval[index]!=firstval)
						{
							requredcontrol=true;
						}
						fisrctval=confirmval[index];
					}
					//alert(requredcontrol);
				}
				
				function confirmobjectControl()
				{
					for (index = 0; index < confirmobject.length; index++) {
						confirmobject[index].addClass("sf-error");
					}
				}
				
				function confirmobjectControlDelete()
				{
					for (index = 0; index < confirmobject.length; index++) {
						confirmobject[index].removeClass("sf-error");
					}
				}
			});
			
				
		};
		
})(jQuery);