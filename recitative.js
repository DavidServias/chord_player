$(document).ready(function(){

  const keyIds = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b" ];
  const chord_qualities = ["major", "minor", "dom7", "dim"];

  //create single key
  const createKey = function(id){
    let container;
    if (id.length > 1) {
      container = $(".flats");
      text = id[0].toUpperCase() + id[1];
    }
    else {
      container = $(".naturals");
      text = id.toUpperCase();
    };
    let key = document.createElement("button");
    key.setAttribute("id", id);
    key.setAttribute("class", "key");
    key.innerHTML = text;
    container.append(key);
  };

  keyIds.forEach(function(id){
    createKey(id);
  });

  //create a single audio element
  const createAudioElement = function myFunction(keyId, type) {
    let el = document.createElement("audio");
    let folder;
    let id;
    let src;
    switch(type){
      case "major":
        id = keyId[0].toUpperCase();
        //for flat keys
        if (keyId.length > 1) {
          id += "b";
        };
        id += "M";
        folder = "audio/major_triads/";
        src = folder + id + ".wav";
        break;
      case "minor":
        id = keyId + "m";
        folder = "audio/minor_triads/";
        src = folder + id + ".wav";
        break;
      case "dom7":
        id = keyId[0].toUpperCase();
        //for flat keys
        if (keyId.length > 1) {
          id += "b";
        };
        id += "dom7";
        folder = "audio/dom7_chords/";
        src = folder + id + ".wav";
        break;
      case "dim":
        id = keyId + "o";
        folder = "audio/dim_triads/";
        src = folder + id + ".wav";
        break;
    };
    el.setAttribute("id", id + "-audio");
    el.setAttribute("src", src);
    el.setAttribute("type", "audio/mpeg");
    document.body.appendChild(el);
  }

  // creates an audio element for each name from the array
  keyIds.forEach(function(keyId) {
    chord_qualities.forEach(function(quality){
      createAudioElement(keyId, quality);
    })
  });

  function Chord_object(root, quality, abbreviation){
    this.root = root;
    this.quality = quality;
    this.abbreviation = abbreviation;
    this.play_chord = function(){
      let audio = $("audio#" + abbreviation + "-audio")[0];
      audio.currentTime = 0;
      audio.play();
    };
    this.pause_chord = function(){
      let audio = $("audio#" + abbreviation + "-audio")[0];
      audio.pause();
    }
  };

  let chord_progression = {
    current_chord:new Chord_object("C", "major", "CM"),
    update_current_chord: function(Chord_object){
      this.current_chord = Chord_object;
    },
    chords:[],
    add_chord: function(root, quality, abbreviation){
      this.chords.push(new Chord_object(root, quality, abbreviation));
    },
    remove_last: ()=> {this.chords.pop();},
    current_index: 0,
    play_current:function() {
      if (this.current_index !== 0) {
        let previous = this.chords[this.current_index-1];
        previous.pause_chord();
      };
      let chord = this.chords[this.current_index];
      chord.play_chord();
      this.current_index += 1;
      if (this.current_index >= this.chords.length){
          this.current_index = 0;
      };
      this.display_progression();
      console.log(chord.abbreviation);
    },
    display_progression:function (){
      let ci = this.current_index;
      $(".chord").remove();
      this.chords.forEach(function(chord, index){
        let element = document.createElement("paragraph");
        element.innerHTML = chord.abbreviation + "<br>";
        element.setAttribute("class", "chord");
        if (index === ci){
          element.setAttribute("id", "current_chord");
        }
        $("#progression").append(element);
      });
    }
  };

  //populates chord progression with "behold a virgin shall conceive"
  chord_progression.add_chord("D", "major", "DM");
  chord_progression.add_chord("A", "dom7", "Adom7");
  chord_progression.add_chord("D", "major", "DM");
  chord_progression.add_chord("Ab", "dim", "abo");
  chord_progression.add_chord("A", "dim", "AM");
  chord_progression.add_chord("D", "major", "DM");
  chord_progression.add_chord("E", "major", "EM");
  chord_progression.add_chord("A", "dim", "AM");
  chord_progression.display_progression();
  //not sure if these are considered global variables, or if this bad practice.
  var chord = $('audio#CM-audio')[0];
  let quality = "major";

  //add event listeners for major and minor buttons
  //toggle background color to show active button
  $("#major").on("click", function(){
    $("#major").css("background-color", "blue");
    $(".quality").css("background-color", "skyBlue");
    quality = "major";
  });

  const selectQuality = function(chordType){
    $(".quality").css("background-color", "skyBlue");
    $("#"+chordType).css("background-color", "blue");
    quality = chordType;
  };

  //add click events to the quality buttons
  chord_qualities.forEach(function(quality){
      $("#" + quality).on("click", () => selectQuality(quality));
  });

  //pressing keys 1-4 also will select the quality
  $("body").on( "keydown", function(event) {
    let e = event.which;
    switch (e){
      case 49:
        selectQuality("major");
        break;
      case 50:
        selectQuality("minor");
        break;
      case 51:
        selectQuality("dom7");
        break;
      case 52:
        selectQuality("dim");
        break;
      case 32:
        chord_progression.play_current();
        break;
    };
  });

  //add event listeners to each button
  var addAudioToButton = function(keyId) {
    $("#" + keyId).click(function(){
      chord.pause();
      let major_chord;
      let minor_chord;
      let dom7_chord;
      let root;
      if (keyId.length > 1){
        root = keyId[0].toUpperCase() + "b";
        major_chord = root + "M-audio";
        dom7_chord = root + "dom7-audio";
      }
      else {
        root = keyId.toUpperCase();
        major_chord = root + "M-audio";
        dom7_chord = root.toUpperCase() + "dom7-audio";
      };
      minor_chord = keyId + "m-audio";
      dim_chord = keyId + "o-audio";
      switch(quality) {
        case "major":
          chord = $('audio#' + major_chord)[0];
          break;
        case "minor":
          chord = $('audio#' + minor_chord)[0];
          break;
        case "dom7":
          chord = $('audio#' + dom7_chord)[0];
          break;
        case "dim":
          chord = $('audio#' + dim_chord)[0];
          break;
      };
      chord.currentTime = 0;
      chord.play();
    });
  };

  //make add audio to each button.
  keyIds.forEach(function(id) {
    addAudioToButton(id);
  });

});
