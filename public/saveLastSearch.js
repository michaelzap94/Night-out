if(localStorage.history){
             var testUrl = "/location?term="+localStorage.history+"&radius="+localStorage.radius;
             var input = $("#searchText[type='text']").val(localStorage.history);

                
                 $.ajax({
                    url: testUrl, // form action url
                    type: 'GET', // form submit method get/post
                    dataType:'json',
                    beforeSend: function() {
                        $("#listEntries").html("");


                        $("#headerSearch").fadeOut(50);
                        $("#loader").show();

                    },
                    success: function(dataRet) {
                        //ITERATE OVER JSON OBJECT.
                        $("#headerSearch").fadeIn();
                        $("#loader").hide();


                    for (var key in dataRet) {
                        if (dataRet.hasOwnProperty(key)) {
                            var val = dataRet[key];
                            var link = val.url;
                            
                            var objectYelp = {
                                displayBarName:val.name,
                                imgUrl:val.image_url,
                                text:val.snippet_text,
                                link:val.url
                            };
                           var jsonObjectYelp = JSON.stringify(objectYelp);
                           var jsonObjectYelp = jsonObjectYelp.replace(/'/g,"&#39;");
                            

                            var btnGoing = '<button id="'+val.id+'" class="yesBtn btn btn-success btn-sm" value="1'+val.id+'">Going</button>';
                            var goingStr = '<span>Going <i class="fa fa-check-circle-o fa-lg"></i> </span>';
                            var btnNotGoing = '<button id="'+val.id+'" class="noBtn btn btn-warning btn-xs" value="0'+val.id+'">Not Anymore</button>';
                            if(val.valueGoing===1){
                            var myButtons = goingStr+'  '+btnNotGoing;

                            }else{
                            var myButtons =btnGoing;

                            }
                            
                            var onEmptyImg = 'if (this.src != "https://www.nattynutrition.com/layout/images/NoPhotoDefault.png?1298563334") this.src = "http://www.nattynutrition.com/layout/images/NoPhotoDefault.png?1298563334";';
                            var defaultImg = "<img src='"+val.image_url+"' height='100' width='100' onerror='"+onEmptyImg +"'  />";
                            //set an id in format "div"+val.id for every div holding buttons in the list
                            var str = "<a href='" + link + "'><li class='service-list'><span class='myimg'>"+defaultImg+"</span><span class='title'><strong>" + val.name + "</strong></span>" + "<p>" + '"'+val.snippet_text + '"'+ "</p><div  id='div"+val.id+"' data-objectyelp='"+jsonObjectYelp+"' class='formButtons'>"+myButtons+"</div></li></a>";
                            $("#listEntries").append(str);
                            $("#listEntries a").attr("target", "_blank");
                        }
                    }
                    ///////////////////////////////////////
                        
                    },
                    error: function(e) {
                        console.log(e)
                    }
                });
                
                
}
                