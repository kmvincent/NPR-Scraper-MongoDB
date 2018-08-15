// Grab the articles as a json
$.getJSON("/articles", function (data) {
  //console.log(data)
  // For each one
  for (var i = 0; i < data.length; i++) {
    $("#articles").append(`
      <div class="card">
      <div class="card-header subHead">${data[i].subCategory}</div>
      <div class="card-body">
        <div class="info">
            <h5 class="card-title">${data[i].title}</h5>
            <p class="card-text">${data[i].summary} <span><a href="${data[i].link}">Full Article</a></span></p>
            <button data-id="${data[i]._id}" class="btn btn-primary addNote" data-toggle="modal" data-target="#noteModal">Add Note</button>
        </div>
        <div class="image img-thumbnail">
            <img src="${data[i].img}" width=auto height=130px>
        </div>
        </div>
        </div>
        </div>
        `)
  }
});

$(document).on("click", "#scrapeBtn", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function (data) {
    location.reload()
  })
})

$(document).on("click", ".addNote", function () {
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      // The title of the article
      $("#titleModal").text(data.title);
      // An input to enter a new title
      $("#notes").append("<h2>Title</h2><input id='titleinput' name='title'>");
      // A textarea to add a new note body
      $("#notes").append("<h2>Comment</h2><textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#savenote").remove()
      $(".modal-footer").append(`<button type="button" class="btn btn-primary" data-id="${data._id}" data-dismiss="modal" id="savenote">Save Note</button>`)
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),

      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
