 $(document).ready(function () {
     
    var listEntries = $("#listEntries");
    var form = $('#searchForm'); // contact form
    //ajax function to get elements from the yelp api
    
    function sendAjax(testUrl){
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
                        var newItem;
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

                            var btnGoing = '<button  id="'+val.id+'" class="yesBtn btn btn-success btn-sm" value="1'+val.id+'">Going</button>';
                            var goingStr = '<span>Going <i class="fa fa-check-circle-o fa-lg"></i> </span>';
                            var btnNotGoing = '<button id="'+val.id+'" class="noBtn btn btn-warning btn-xs" value="0'+val.id+'">Not Anymore</button>';
                            console.log(val.valueGoing);
                            if(val.valueGoing===1){
                            var myButtons = goingStr+'  '+btnNotGoing;

                            }else{
                            var myButtons =btnGoing;

                            }
                            
                            var onEmptyImg = 'if (this.src != "https://www.nattynutrition.com/layout/images/NoPhotoDefault.png?1298563334") this.src = "http://www.nattynutrition.com/layout/images/NoPhotoDefault.png?1298563334";';
                            var defaultImg = "<img src='"+val.image_url+"' height='100' width='100' onerror='"+onEmptyImg +"'  />";
                            //set an id in format "div"+val.id for every div holding buttons in the list
                            var str = "<a href='" + link + "'><li class='service-list'><span class='myimg'>"+defaultImg+"</span><span class='title'><strong>" + val.name + "</strong></span>" + "<p>" + '"'+val.snippet_text + '"'+ "</p><div data-objectyelp='"+jsonObjectYelp+"' id='div"+val.id+"' class='formButtons'>"+myButtons+"</div></li></a>";
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
    
        form.on('submit', function(e) {
            e.preventDefault(); // prevent default form submit

            var input = $("#searchText[type='text']").val();

            if(input!=="") {
                


                localStorage.setItem("history",input.toString());
                localStorage.setItem("radius",30000);

                var testUrl = "https://fcc-back-end-2-michaelzap94.c9users.io/location?term="+input.toString();
                
                 sendAjax(testUrl);//calls the function sendAjax.
            }
        });
    
    $("#nearEvents").on("click",function(e){
        e.preventDefault();
        $("#searchText[type='text']").val("pub");
        var testUrl = "https://fcc-back-end-2-michaelzap94.c9users.io/location?radius=5000";
        localStorage.history = "pub";
        localStorage.radius = 5000;

        sendAjax(testUrl);
    });

        
    


});