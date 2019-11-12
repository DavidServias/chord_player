$(document).ready(function(){

  const keyIds = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b" ];
  const chord_qualities = ["maj", "min", "7", "o"];

  //CREATE HTML ELEMENTS
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
    key.setAttribute("class", "key col-sm");
    key.innerHTML = text;
    container.append(key);
  };

  keyIds.forEach(function(id, index){
    createKey(id);
  });

  //CREATE AUDIO ELEMENTS
  //create a single audio element
  const createAudioElement = function myFunction(keyId, quality) {
    let el = document.createElement("audio");
    let fileName = "audio/" + keyId + quality + ".wav";
    el.setAttribute("id", keyId + quality + "-audio");
    el.setAttribute("src", fileName);
    el.setAttribute("type", "audio/mpeg");
    document.body.appendChild(el);
  }

  // creates an audio element for each name from the array
  keyIds.forEach(function(keyId) {
    chord_qualities.forEach(function(quality){
      createAudioElement(keyId, quality);
    })
  });

  let Chord_object = function (root, quality){
    this.root = root;
    this.quality = quality;
    this.set_root = function(newRoot){
      this.root = newRoot;
      $(".flats .key").css("background-color", "black");
      $(".naturals .key").css("background-color", "white");
      $("#" + newRoot).css("background-color", "green");
    };
    this.set_quality = function(newQuality){
      this.quality = newQuality;
    };
    this.play_chord = function(){
      let audio_string = "audio#" + this.root + this.quality + "-audio";
      let audio = $(audio_string)[0];
      audio.currentTime = 0;
      audio.play();
    };
    this.pause_chord = function(){
      let audio_string = "audio#" + this.root + this.quality + "-audio";
      let audio = $(audio_string)[0];
      audio.pause();
    }
  };

  let chord_progression = {
    active_chord: new Chord_object("c", "maj", "CM"),
    play_active: function(){
      this.active_chord.play_chord();
      this.last_chord = this.active_chord;
    },
    last_chord: new Chord_object("c", "maj", "CM"),
    chords:[["c","maj"]],
    set_active_quality: function(quality){
      $(".quality").removeClass("active_quality");
      $("#" + quality).addClass("active_quality");
      this.active_chord.set_quality(quality);
    },
    set_active_root: function(root){
      this.active_chord.set_root(root);
    },
    add_chord: function(){
      this.chords.push([this.active_chord.root, this.active_chord.quality]);
      this.display_progression();
    },
    remove_last: function(){
      if (this.chords.length === 0){
      } else if(this.current_index === this.chords.length-1){
          this.current_index -= 1;
      }
      this.chords.pop();
      this.display_progression();
    },
    current_index: 0,
    play_current:function() {
      if (this.current_index === -1){
        this.current_index = 0;
      };
      let root = this.chords[this.current_index][0];
      let quality = this.chords[this.current_index][1];
      this.active_chord.set_root(root);
      this.active_chord.set_quality(quality);
      this.play_active();
      this.last_chord = this.active_chord;
      this.display_progression();
    },
    play_next_in_progression: function() {
      //advance the index if not last, and if chords > 1
      if (this.chords.length > 1 && this.current_index !== this.chords.length-1) {
        this.current_index += 1;
      };
      this.play_current();
      this.display_progression();
    },
    play_prev: function() {
      if (this.chords.length > 1 && this.current_index !== 0){//indicates first time
        this.current_index -= 1;
      };
      this.play_current();
      this.display_progression();
    },
    display_progression:function (){
      let active_index = this.current_index;
      $(".chord").remove();
      let that = this;
      this.chords.forEach(function(chord, index){
        let element;
        let suffix;
        let root;
        let id = "index-" + index;
        if (chord[0].length > 1) {
          root = chord[0][0].toUpperCase() + chord[0][1];
        } else {
          root = chord[0].toUpperCase();
        };
        switch(chord[1]) {
          case "maj":
            suffix = "";
            break;
          case "min":
            suffix ="m";
            break;
          default:
            suffix = chord[1];
            break;
        };
        element = $("<span></span>").text(root + suffix);
        $("#progression").append(element);
        element.addClass("chord badge pill-badge badge-primary");
        if (index === active_index){
          element.attr("id","current_chord");
        };
        element.on("click", function(){
          that.last_chord.pause_chord();
          that.current_index = index;
          that.display_progression();
          that.play_current();
        });
      });
    }

  };

  chord_progression.display_progression();

  //add click events to the quality buttons
  chord_qualities.forEach(function(quality){
      $("#" + quality).on("click", function() {
        chord_progression.set_active_quality(quality);
      });
  });

  //pressing keys 1-4 also will select the quality
  $("body").on( "keydown", function(event) {
    chord_progression.last_chord.pause_chord();
    let e = event.which;
    switch (e){
      case 49:
        chord_progression.set_active_quality("maj");
        break;
      case 50:
        chord_progression.set_active_quality("min");
        break;
      case 51:
        chord_progression.set_active_quality("7");
        break;
      case 52:
        chord_progression.set_active_quality("o");
        break;
      case 39:
        chord_progression.play_next_in_progression();
        break;
      case 37:
        chord_progression.play_prev();
        break;
      case 40:
        chord_progression.play_current();
        break;
      case 187://plus/=
        chord_progression.add_chord();
        break;
      case 8://backspace
      case 46://delete
        chord_progression.remove_last();
        break;
    };
  });

  function addEventListener(keyId){
    $("#" + keyId).on("click", function(){
      chord_progression.set_active_root(keyId);
      $(".flats .key").css("background-color", "black");
      $(".naturals .key").css("background-color", "white");
      $("#" + keyId).css("background-color", "green");
    });
  };

//make add audio to each button.
  keyIds.forEach(function(id){
    addEventListener(id);
  });

  $("#play_chord").on("click", function(){
    chord_progression.last_chord.pause_chord();
    chord_progression.play_active();
  });

  $("#add_chord").on("click", function(){
    chord_progression.add_chord();
  });

  $("#remove_last").on("click", function(){
    chord_progression.remove_last();
  });

  $("#right_arrow").on("click", function(){
    chord_progression.last_chord.pause_chord();
    chord_progression.play_next_in_progression();
  });

  $("#left_arrow").on("click", function(){
    chord_progression.last_chord.pause_chord();
    chord_progression.play_prev();
  });

  $("#down_arrow").on("click", function(){
    chord_progression.last_chord.pause_chord();
    chord_progression.play_current();
  });


});
