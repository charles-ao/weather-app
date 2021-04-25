$(document).ready(function () {
    $('.wrapper').hide();
    setTimeout(() => {
        $('.wrapper').show();
        $('.gif').hide();
    }, 1500);

    

    const weekday = ['sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const month = ['january', 'february', 'march', 'april', 'may', 'june',
                    'july', 'august', 'september', 'october', 'november', 'december']

    key = '8b0300ea53d7998f102de029304f41e5';

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPosition)
    } else {
        console.log('Location not set');
    }

    function getPosition(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        getWeather(latitude, longitude)
        getOneCallWeather(latitude, longitude)
    }

    function getWeather(lat, lon) {
        fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
        ).then(function(response){
            return response.json();
        }).then(function (data) {

            const milliseconds = (data.dt) * 1000;
            const date = new Date(milliseconds);

            const currentTime = new Date().getTime();
            const oneDay = 24*60*60*1000;
            const oneHour = 60*60*1000;
            const oneMinute = 60*1000;

            const hr = Math.ceil((currentTime % oneDay)/oneHour)
            const mn = Math.floor((currentTime % oneHour)/oneMinute)
                
            let hours = hr <10 ? `0${hr}`:hr;
            let minutes =  mn <10? `0${mn}`: mn;

            const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`


            $('.location h3').text(`${data.name}, ${data.sys.country}`);
            $('.date h3').text(`${weekday[date.getDay()]} ${date.getDate()}, ${month[date.getMonth()]}`);
            $('.time h3').text(`${hours}:${minutes}`);

            $('#wea-ico').attr('src', icon);
            $('.weather-desc h3').text(`${data.weather[0].description}`)
            $('.weather-temp h1').text(`${Math.floor(data.main.temp -273)}°C`)

            $('#feels-like h2').text(`${Math.floor(data.main.feels_like -273)}°C`)
            // sunrise
            const shr = Math.ceil(((data.sys.sunrise*1000) % oneDay)/oneHour)
            const smn = Math.floor(((data.sys.sunrise*1000) % oneHour)/oneMinute)
            const sunriseHr = shr < 10 ? `0${shr}` : shr
            const sunriseMn =smn < 10 ?  `0${smn}`: smn
            $('#sunrise h2').text(sunriseHr + ':' + sunriseMn)
            // sunset
            const rhr = Math.ceil(((data.sys.sunset*1000) % oneDay)/oneHour)
            const rmn = Math.floor(((data.sys.sunset*1000) % oneHour)/oneMinute)
            const sunsetHr = rhr < 10 ? `0${rhr}` : rhr
            const sunsetMn = rmn < 10 ? `0${rmn}` : rmn
            $('#sunset h2').text(sunsetHr + ':' + sunsetMn)

            $('#humidity h2').text(`${data.main.humidity}%`)
            $('#pressure h2').text(`${data.main.pressure}hPa`)
            $('#wind h2').text(`${data.wind.speed}m/s`)
            


            }).catch(function (err) {
            	console.warn('Something went wrong.', err);
            });
    }

    function getOneCallWeather(lat, lon) {
        fetch( `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`
        ).then(function(response){
            return response.json();
        }).then(function (data) {

                // Hourly forecast
                for (let  index = 0;  index < 7;  index++) {
                    let itemTemp = $(`#hour${index} p:last`);
                    const valueTemp = `${Math.floor(data.hourly[index].temp -273)}°`;
                    itemTemp.text(valueTemp)

                    let itemIcon = $(`#hour${index} img`);
                    const valueImg = `https://openweathermap.org/img/wn/${data.hourly[index].weather[0].icon}@4x.png`
                    itemIcon.attr('src', valueImg)

                    

                    const oneDay = 24*60*60*1000;
                    const oneHour = 60*60*1000;
                
                    let hour = Math.floor(((data.hourly[index].dt * 1000) % oneDay)/oneHour + 1) 
                    
                    let itemTime = $(`#hour${index} p:first`);
                    itemTime.text(`${hour}: 00`)

                    if (new Date().getDate() === new Date(data.hourly[0].dt * 1000).getDate() ) {
                        $(`#hour0 p:first`).text('Now');
                    }

                    if (hour === 24) {
                        hour = '00'
                        itemTime.text(`${hour}: 00`)
                    }
                }

                // Daily forecast 
                for (let  index = 0;  index < 7; index++) {
                    let itemTemp = $(`#daily${index} p:last`);
                    const valueTemp = `${Math.floor(data.daily[index].temp.max -273)}°`;
                    itemTemp.text(valueTemp)

                    let itemIcon = $(`#daily${index} img`);
                    const valueImg = `https://openweathermap.org/img/wn/${data.daily[index].weather[0].icon}@4x.png`
                    itemIcon.attr('src', valueImg)

                    let forecastedFig = new Date(data.daily[index].dt * 1000);
                    const mo = forecastedFig.getMonth()+1;
                    const dy = forecastedFig.getDate();
                    let forecastMonth =mo <10? `0${mo}`  : mo;
                    let forcastDate =dy <10? `0${dy}`  : dy;
                    let itemDay = $(`#daily${index} p:first`);
                    itemDay.text(forcastDate + '/'+ forecastMonth)

                    if (new Date().getDate() === new Date(data.daily[0].dt * 1000).getDate() ) {
                        $(`#daily0 p:first`).text('Today');
                    }
                }





    

                
            }).catch(function (err) {
            	// There was an error
            	console.warn('Something went wrong.', err);
            });
    }

});
