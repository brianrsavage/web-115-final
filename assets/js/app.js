var config = {
	homeSlider: { displayNum: 3, count: 0 },
	homeCards: { displayNum: 6, count: 0 },
	homeTags: { displayNum: 30, count: 0 },
	players: {},
	crimes: {}
}

window.onload = init;

function init() {
	$.getJSON('https://nflarrest.com/api/v1/player?limit=200', function(result) {
		$.each(result, function(i, data) {
			cardBuilder(data);
		});
	});
	$.getJSON('https://nflarrest.com/api/v1/crime', function(result) {
		$.each(result, function(i, data) {
			if (i < config.homeSlider.displayNum) {
				buildSlide(data);
			} else if (i < (config.homeTags.displayNum + config.homeCards.displayNum + config.homeSlider.displayNum)) {
				$('.tags-holder').append(buildButton(data));
			} else {
				$('.links-holder').append(buildLink(data));
			}
		});
	});
}

function cardBuilder(data) {
	$.getJSON('https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=' + data.Name, function(result) {
		if (window.config.homeCards.count < window.config.homeCards.displayNum && result.player) {
			let curObj = result.player[0];
			if (curObj.strPlayer && curObj.strThumb && curObj.strSport.match(/football/i)) {
				config.players[curObj.idPlayer] = curObj;
				config.players[curObj.idPlayer].arrest_count = data.arrest_count;
				config.homeCards.count++;
				x = `
          <div id="card-${config.homeCards.count}" class="col-md-4 animated jackInTheBox">
            <div class="card mb-4 shadow-sm">
              <img src="${config.players[curObj.idPlayer].strThumb}" class="bd-placeholder-img card-img-top" width="100%" height="225">
              <div class="card-body">
                <h5 class="card-title">${config.players[curObj.idPlayer].strPlayer}</h5>
                <p class="card-text"><span class="d-inline-block text-truncate" style="max-width: 100%; max-height: 150px;">${config.players[curObj.idPlayer].strPosition} | ${config.players[curObj.idPlayer].strTeam}</span></p>
                <div class="d-flex justify-content-between align-items-center">
                  <a id="${config.players[curObj.idPlayer].idPlayer}" onclick="btnClicked(this, 'player');" href="#" class="btn btn-dark my-2">More This</a>
                  <small class="text-muted">${data.arrest_count} arrests</small>
                </div>
              </div>
            </div>
          </div>
				`;
				$('.cards-holder').append(x);
			}
		}
	});
}

function btnClicked(data, focus) {
	$('#infoMdlCenterTitle').html('');
	$('#infoMdlContent').append('');
	switch (focus) {
		case "player":
			$('#infoMdlCenterTitle').html(config.players[data.id].strPlayer);
			$('#infoMdlContent').html(`<p>${config.players[data.id].strDescriptionEN}</p>`);
			break;
		case "crime":
			$('#infoMdlCenterTitle').html(data);
			$.getJSON('https://nflarrest.com/api/v1/crime/arrests/' + data + '?limit=10', function(result) {
				$.each(result, function(i, data) {
					$('#infoMdlContent').append(`<ul>
              <li>${data.Name} of the ${data.Team_preffered_name}
                <ul>
                  <li>${data.Season} ${data.ArrestSeasonState}</li>
                  <li>${data.Description}</li>
                  <li>${data.Outcome}</li>
                </ul>
              </li>
              <ul>`);
				});
			});
			break;
		default:
			$('#infoMdlCenterTitle').html('Title is unavilable');
			$('#infoMdlContent').html('Content is unavilable');
	}
	$('#infoMdlCenter').modal('show');
}

function buildSlide(data) {
	var cnt = ++window.config.homeSlider.count;
	$('.carousel-indicators').append(`
    <li data-target="#carouselIndicators" data-slide-to="${cnt}"}></li>
    `);
	$('.carousel-inner').append(`
    <div class="carousel-item">
        <img class="d-block w-100 slide-image" src="https://source.unsplash.com/1600x600/?nfl-stadium,nfl,american-football&sig=${Math.random()}" alt="Third slide">
      <div class="carousel-caption">
      <h1>${data.arrest_count} ${data.Category}  Arrests in the NFL</h1>
        <h3>The number 1 crime committed in the NFL is ${data.Category}.</h3>
        <p>The number of arrests is currently at ${data.arrest_count}.</p>
        <a href="#" class="btn btn-dark" onclick="btnClicked('${data.Category}', 'crime');">Read More</a>
      </div>
    </div>
  `);
}

function buildButton(data) {
	return `
              <button id="${data.Category}-btn" type="button" class="btn btn-dark btn-sm animated bounceInUp"  onclick="btnClicked('${data.Category}', 'crime');">
                  ${data.Category}    <span class="badge badge-light">${data.arrest_count}</span>
              </button>
       `;
}

function buildLink(data) {
	return `
              <a id="${data.Category}-link"  href="#" class="badge badge-light cat-link animated bounceInUp"  onclick="btnClicked('${data.Category}', 'crime');">
                  ${data.Category} ( ${data.arrest_count} )
              </a>
       `;
}