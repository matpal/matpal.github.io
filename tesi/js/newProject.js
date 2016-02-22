/* global blocks */
/* global joint */
/* global $ */
$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal({
        dismissible: true,
        height: '100%',
    });


});


var App = blocks.Application();

var Activity = App.Model({
    nome: blocks.observable(""),
    isAttiva: blocks.observable(false),
    paper: blocks.observable(),
    recs: blocks.observable([]),
    recsName: blocks.observable([]),
    zoomLevel: blocks.observable(1),

    toggleAttiva: function() {
        this.isAttiva(!this.isAttiva());
    },

    populateRecsName: function(){
        this.recsName.removeAll();
        for(var i = 0; i < this.recs().length; i++){
            //se non è un link lo aggiungo alla lista dei rettangoli con nomi
            if(!this.recs()[i].attributes.hasOwnProperty("target")){
                this.recsName.push(this.recs()[i]);
            }
        }

    },

    setAttiva: function(){
        var elenco = App.NewProject.activities;
        for(var i=0; i< elenco().length; i++){
            if(elenco()[i].isAttiva()){
                elenco()[i].toggleAttiva();
            }
        }
        this.toggleAttiva();

        if(this.recs().length == 0){
            this.createPaper();
            this.createActivityDiagram();
            App.NewProject.currentActivity = this;
            App.NewProject.updateDiagram();
        }else{
            App.NewProject.currentActivity = this;
        }


    },

    zoomIn: function(){
        this.zoomLevel( this.zoomLevel() + 0.2);
        this.paper.paper.scale(this.zoomLevel());
    },
    zoomOut: function(){
        this.zoomLevel( this.zoomLevel() - 0.2);
        this.paper.paper.scale(this.zoomLevel());
    },

    fitDiagram: function(){
      this.paper.paper.scaleContentToFit();
    },
    layoutDiagram: function(){
        joint.layout.DirectedGraph.layout(
            this.paper.graph,
            {
                setLinkVertices: false,
                rankDir: "BT"
            }
        );
    },

    createPaper: function(){
        this.paper = ((this.paper instanceof MyPaper) ? this.paper : new MyPaper($('#'+this.nome)));
    },

    createActivityDiagram: function(){
        if(this.paper instanceof MyPaper){

            if(this.paper.graph.getCells().length == 0){
                var r = AndroidRect(0,0, this.nome(), 'activity');

                this.recs.add(r);
                $(window).on('resize', function(){
                    App.NewProject.currentActivity.paper.paper.setDimensions( window.innerWidth * 0.75, 500);
                });
            }
        }
        // location.href = "#"+this.nome;
    },

    showMenu: function(){
        var fn = App.NewProject.openModalFromContextMenu;
        var opt = {}

        if(this.paper.graph.attributes.cells.length < 2){
            opt = {
                'Add Android Component': fn,
                'Add Custom Class': fn,
            }
        }else{
            opt = {
                'Add Android Component': fn,
                'Add Custom Class': fn,
                'Add Relation' : fn
            }
        }

        $('#'+this.nome).contextmenu(opt, 'right');
    },
});


var Activities = App.Collection(Activity);


App.View('NewProject', {
    activities: Activities(),
    currentActivity: Activity(),
    // recsID: blocks.observable([]),
    // projectFile: blocks.observable(),
    project: blocks.observable(""),
    projects: blocks.observable([]),


    saveToJSON: function(){
        if(typeof(Storage) !== "undefined") {
            if(this.project() != ''){
                // {"projects":["colors","citta","cose"]}
                var messaggio = "";

                // carica l'elenco dei nomi dei progetti o crea l'entry nel localStorage
                var projArray = JSON.parse(localStorage.getItem("UMLAndroid-Projects"));
                if(!projArray){
                    projArray = {
                        "projects": []
                    };
                    localStorage.setItem("UMLAndroid-Projects", JSON.stringify(projArray));
                }

                // carica elenco delle activity
                var elenco = this.activities();

                if(elenco.length > 0){
                    // cerca nell'elenco se esiste gia un progetto con questo nome
                    // se il progetto non è presente...
                    if(projArray["projects"].indexOf(this.project()) === -1){
                        // salva il nome del progetto
                        projArray["projects"].push(this.project());
                        localStorage.setItem("UMLAndroid-Projects", JSON.stringify(projArray));
                        messaggio = "Progetto salvato.";

                    }
                    // se esiste già un progetto con questo nome, sovrascrivo
                    else if (projArray["projects"].indexOf(this.project() > -1)){
                        messaggio = "Progetto sovrascritto.";
                    }

                    // per ogni Activity creo un'entry nel localStorage per salvare il suo graph
                    for(var i = 0; i < elenco.length; i++){
                        var key = "UMLAndroid-" + this.project() + "-activity-" + elenco[i].nome();
                        var value = JSON.stringify(elenco[i].paper.graph.toJSON());
                        localStorage.setItem(key, value);
                    }

                    console.log(messaggio);
                    $('#savedProject').openModal();

                }else{
                    console.log("Non sono presenti Activities da salvare.");
                }


            }else{
                console.log("Project name empty.")
            }

      } else {
          console.log("No Web Storage support.");
      }
    },

    loadFromJSON: function(){
      if(typeof(Storage) !== "undefined") {

          var projName = $('#projectName').find(":selected").attr('id');
          this.project(projName);

          this.activities.removeAll();
          this.currentActivity.reset();

        //   Crea le Activity a partire dai valori trovati nel localStorage
          for(var i = 0; i < localStorage.length; i++){
              var l = "UMLAndroid-".length + projName.length;

              if(localStorage.key(i).substring(0,l) == "UMLAndroid-"+projName){

                  var activityName = localStorage.key(i).substring(l+1);
                  this.currentActivity = Activity({
                      nome: activityName
                  });

                // aggiorna l'elenco delle activities
                this.activities.add(this.currentActivity);
              }
          }

          var elenco = this.activities();
          for(var i = 0; i < elenco.length; i++){
              elenco[i].createPaper();
              elenco[i].setAttiva();
              elenco[i].paper.graph.fromJSON(JSON.parse(localStorage.getItem("UMLAndroid-"+projName+"-activity-"+elenco[i].nome())));
              elenco[i].recs.removeAll();
              elenco[i].recs.addMany(elenco[i].paper.graph.getCells());
          }
          // visualizza la prima Activity
          elenco[0].setAttiva();
          $('.tooltipped').tooltip({delay: 0});

      } else {
        console.log("No Web Storage support.");
      }

    },

    loadProjects: function(){
        if(typeof(Storage) !== "undefined") {


            var projArray = JSON.parse(localStorage.getItem("UMLAndroid-Projects"));
            if(projArray["projects"].length >= 1){
                this.projects.removeAll();
            }

            for(var t = 0; t < projArray["projects"].length; t++){
                // this.project = Project({
                //     nome: projArray["projects"][t],
                // });
                this.project(projArray["projects"][t]);
                this.projects.add(this.project);
                // this.project.reset();
                // this.project("");
            }


        } else {
            console.log("No Web Storage support.");
        }
    },

    activitiesEmpty: blocks.observable(function(){
        return this.activities().length == 0;
    }),
    projectsEmpty: blocks.observable(function(){
        return this.projects().length == 0;
    }),

    newActivity: function(){
        this.currentActivity = Activity({
            nome: $('#inputActivityName').val(),
        });
        this.currentActivity.setAttiva();

        this.activities.add(this.currentActivity);
        $('#inputActivityName').val('');
        $('.tooltipped').tooltip({delay: 0});
        this.activities()[this.activities().length-1].setAttiva();

    },

    openAndroidComponentModal: function(){
        this.currentActivity.populateRecsName();
        $('select').material_select();
        $('#' + this.currentActivity.nome + 'NewAndroidComponentModal').openModal();
    },
    openCustomClassModal: function(){
        this.currentActivity.populateRecsName();
        $('select').material_select();
        $('#' + this.currentActivity.nome + 'NewCustomClassModal').openModal();
    },
    openCustomLinkModal: function(){
        this.currentActivity.populateRecsName();
        $('select').material_select();
        $('#' + this.currentActivity.nome + 'NewCustomLinkModal').openModal();
    },
    openProjectModal: function(){
        this.loadProjects();
        $('select').material_select();
        // $('#modal1').openModal();
    },

    openModalFromContextMenu: function(evt,parent){

        switch(evt.target.textContent){

            case "Add Relation":
                this.openCustomLinkModal();
                break;

            case "Add Custom Class":
                this.openCustomClassModal();
                break;


            case "Add Android Component":
                this.openAndroidComponentModal();
                break;
        }
    },


    addCustomClassTo: function(){
        createCustomClass(this);
    },

    addAndroidComponentTo: function(){
        createAndroidComponent(this);
    },

    addCustomLink: function(){
       createCustomLink(this);
    },

    updateDiagram: function(){
        this.currentActivity.paper.graph.addCells(this.currentActivity.recs());
        // joint.layout.DirectedGraph.layout(
        //     this.currentActivity.paper.graph,
        //     {
        //         setLinkVertices: false,
        //         rankDir: "BT"
        //     }
        // );
        this.currentActivity.layoutDiagram();
        if(this.currentActivity.recs().length > 10){
            this.currentActivity.fitDiagram();
        }


    },
});
