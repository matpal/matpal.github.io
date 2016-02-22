/* global blocks */
/* global $ */
/* global createCustomLink */
/* global createCustomClass */
/* global createAndroidComponent */
/* global searchArrayOfObj */
$(document).ready(function() {

  $(".button-collapse").sideNav({
      menuWidth: 350,
  });


  // close sideNav on click
  $('#dropActivityMenu').click(function(){
      $('.button-collapse').sideNav('hide');
  });

  //   Modal

  $('.modal-trigger').leanModal({
      dismissible: true,
      height: '100%',
  });
  $('#androidManifestModal').openModal();

});


var App = blocks.Application();
var TEMP_FILE_CONTENT = "";
var TEMP_FILE_NAME = "";


function searchForIntents(inputString){
    var lines = inputString.split('\n');
    var regola = /\w*\s*=\s*new Intent\w*/;
    var regola2 = /\w*.class/;
    var tempResult = [];
    var result = [];
    var intentName="", intentType = "implicitIntent";

    for(var i= 0; i< lines.length; i++){
        if(lines[i].match(regola)){
            tempResult.push(lines[i].trim().split(' '));
        }
    }

    for(var i= 0; i< tempResult.length; i++){
        for(var j= 0; j< tempResult[i].length; j++){
            intentType = "implicitIntent";
            if (tempResult[i][j] === 'Intent'){
                intentName = tempResult[i][j+1];
            }
            // if (tempResult[i][j].match(new RegExp('/\w*.class/'))){
            if (tempResult[i][j].match(regola2)){
                // intentName = tempResult[i][j].split('.')[0];
                var word = tempResult[i][j];
                intentName = word.substring(word.lastIndexOf(",")+1, word.lastIndexOf("."));
                intentType= "explicitIntent";
            }
        }
        result.push({name: intentName, type: intentType});
    }

    return result;
}

function searchForServices(inputString){
    var lines = inputString.split('\n');
    var regola1 = /\w*startService\w*/;
    var regola2 = /\w*bindService\w*/;
    var temp = [];
    var result = [];

    for(var i = 0; i < lines.length; i++ ){
        if(lines[i].match(regola1) || lines[i].match(regola2)){
            temp.push(lines[i].trim().split(' '));
        }
    }

    var regola= /\w*.class/;
    for(var i = 0; i < temp.length; i++ ){
        for(var j = 0; j < temp[i].length; j++){
            if(temp[i][j].match(regola)){
                result.push(temp[i][j].trim().split('.')[0]);
            }
        }
    }

    return result;
}

function searchForReceivers(inputString){
    var lines = inputString.split('\n');
    var regola1 = /\w*\.sendBroadcast\w*/;
    var regola2 = /\w*\.sendStickyBroadcast\w*/;
    var temp = [];
    var result = [];

    // cerca le righe che fanno match con le regole
    for(var i = 0; i < lines.length; i++ ){
        if(lines[i].match(regola1) || lines[i].match(regola2)){
            temp.push(lines[i].trim().split(' '));
        }
    }

    // estrapola il nome della classe e lo aggiunge all'array result
    for(var i = 0; i < temp.length; i++ ){
        for(var j = 0; j < temp[i].length; j++){
            if(temp[i][j].match(regola1) || temp[i][j].match(regola2)){
                result.push(temp[i][j].trim().split('.')[0]);
            }
        }
    }

    return result;
}

function searchForContentProviders(inputString){
    var lines = inputString.split('\n');
    var regola1 = /\w*\.getContentResolver\w*/;
    var temp = [];
    var result = [];

    for(var i = 0; i < lines.length; i++ ){
        if(lines[i].match(regola1)){
            temp.push(lines[i].trim().split(' '));
        }
    }

    for(var i = 0; i < temp.length; i++ ){
        for(var j = 0; j < temp[i].length; j++){
            if(temp[i][j].match(regola1)){
                result.push("Content Provider");
            }
        }
    }

    return result;
}

function searchFor(inputString, regExpr){
        var lines = inputString.split('\n');

        for(var i=0; i < lines.length; i++){
            if(lines[i].match(regExpr)){
                var words = lines[i].trim().split(' ');
                return words;
            }
        }
        return null;
}


/*
 *
 *  MODELS
 *
 */

var AndroidManifest = App.Model({
    fileName: blocks.observable(""),
    fileContent: blocks.observable(""),
    uploaded: blocks.observable(false),
});

var Messages = App.Model({
    error : blocks.observable(""),
    layoutFile: blocks.observable(""),
    javaFile: blocks.observable("")
});


var Activity = App.Model({
    nome : blocks.observable(),
    isAttiva: blocks.observable(false),
    messages: Messages(),
    paper: blocks.observable(),
    zoomLevel: blocks.observable(1),

    layoutFile: blocks.observable(),
    layoutFileUploaded: blocks.observable(false),
    javaFile: blocks.observable(),
    javaFileUploaded: blocks.observable(false),

    recs: blocks.observable([]),
    recsLayout: blocks.observable([]),
    recsJava: blocks.observable([]),
    recsName: blocks.observable([]),


    toggleAttiva: function() {
        this.isAttiva(!this.isAttiva());
    },

    zoomIn: function(){
        this.zoomLevel( this.zoomLevel() + 0.2);
        this.paper.paper.scale(this.zoomLevel());
    },
    zoomOut: function(){
        this.zoomLevel( this.zoomLevel() - 0.2);
        this.paper.paper.scale(this.zoomLevel());
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
    fitDiagram: function(){
      this.paper.paper.scaleContentToFit();
    },


    toggleJavaElements: function(){
        this.recsJava().forEach(function(element){
            if(element.attr('./display') === 'none'){
                element.attr('./display', 'block');
            }else{
                element.attr('./display', 'none');
            }
        });
    },
    toggleLayoutElements: function(){
        this.recsLayout().forEach(function(element){
            if(element.attr('./display') === 'none'){
                element.attr('./display', 'block');
            }else{
                element.attr('./display', 'none');
            }
        });
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

    createPaper: function(){
        // this.paper = ((this.paper instanceof MyPaper) ? this.paper : new MyPaper($('#'+this.nome)));
        this.paper = ((this.paper instanceof MyPaper) ? this.paper : new MyPaper(document.getElementById(this.nome)));
    },

    createActivityDiagram: function(){
        if(this.paper instanceof MyPaper){

            if(this.paper.graph.getCells().length == 0){
                var r = AndroidRect(0,0, this.nome(), 'activity');

                this.recs.add(r);
                $(window).on('resize', function(){
                    App.ExistingProject.currentActivity.paper.paper.setDimensions( window.innerWidth * 0.75, 500);
                });
            }
        }

        // $('.tooltipped').tooltip({delay: 0});
        // location.href = '#' + this.nome;
    },

    setAttiva: function(){
        var activityNames = App.ExistingProject.activities;
        for(var i=0; i< activityNames().length; i++){
            if(activityNames()[i].isAttiva()){
                activityNames()[i].toggleAttiva();
            }
        }

        this.toggleAttiva();

        if(this.recs().length == 0){
            this.createPaper();
            this.createActivityDiagram();
            App.ExistingProject.currentActivity = this;
            App.ExistingProject.updateDiagram();
        }else{
            App.ExistingProject.currentActivity = this;
        }

    },

    showMenu: function(){
      var fn = App.ExistingProject.openModalFromContextMenu;
      var elem = $('#'+this.nome);
      var opt = {};

      if(this.paper.graph.attributes.cells.length < 2){
          opt = {
            'Add Android Component': fn,
            'Add Custom Class': fn,
          }
      }else{
          opt = {
            'Add Android Component': fn,
            'Add Custom Class': fn,
            'Add Relation' : fn,
          }
      }

      elem.contextmenu(opt, 'right');
    },


    loadJavaFile: function(evt){
        var file = document.getElementById("javaFile"+this.nome()).files[
            0];
        var fileType = /\.java$/;

        this.messages.javaFile("");

        if (file) {

            if (file.name.match(fileType)) {
                var reader = new FileReader();
                var cb = function(data,filename) {
                    TEMP_FILE_CONTENT = data;
                    TEMP_FILE_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            var curActivity = this.App.ExistingProject.currentActivity;
                            var r = null;
                            var link = null;

                            curActivity.javaFile(TEMP_FILE_CONTENT);
                            curActivity.javaFileUploaded(true);

                            var servicesFound = searchForServices(curActivity.javaFile());
                            if(servicesFound){
                                for (var i = 0; i < servicesFound.length; i++) {
                                    r = AndroidRect( 10,10,servicesFound[i],'service');
                                    curActivity.recsJava.add(r);
                                    App.ExistingProject.updateDiagram();

                                    //  Crea funzione update "linked" per servizi,providers,ecc
                                    // for(var t= 0; t< App.ExistingProject.services().length; t++){
                                    //     if(App.ExistingProject.services()[t].nome() == servicesFound[i]){
                                    //         App.ExistingProject.services()[t].linked(true);
                                    //     }
                                    // }
                                    App.ExistingProject.services().forEach(function(element){
                                        if(element.nome() == servicesFound[i]){
                                            element.linked(true);
                                        }
                                    });

                                    link = createUmlLink(r.id, curActivity.recs()[0].id, "association" );
                                    curActivity.recsJava.add(link);
                                    // curActivity.paper.graph.addCell(link);
                                }
                            }


                            var intentsFound = searchForIntents(curActivity.javaFile());
                            if(intentsFound){
                                for (var i = 0; i < intentsFound.length; i++) {
                                    r = AndroidRect( 10,10,intentsFound[i].name,intentsFound[i].type);
                                    curActivity.recsJava.add(r);


                                    link = createUmlLink(r.id, curActivity.recs()[0].id, "association" );
                                    // curActivity.paper.graph.addCell(link);
                                    curActivity.recsJava.add(link);
                                    App.ExistingProject.updateDiagram();
                                }
                            }


                            var receiversFound = searchForReceivers(curActivity.javaFile());
                            if(receiversFound){
                                for (var i = 0; i < receiversFound.length; i++) {
                                    r = AndroidRect( 10,10,receiversFound[i],'broadcastReceiver');
                                    curActivity.recsJava.add(r);


                                    App.ExistingProject.receivers().forEach(function(element){
                                        if(element.nome() == receiversFound[i]){
                                            element.linked(true);
                                        }
                                    });

                                    link = createUmlLink(r.id, curActivity.recs()[0].id, "association" );
                                    // curActivity.paper.graph.addCell(link);
                                    curActivity.recsJava.add(link);

                                    App.ExistingProject.updateDiagram();
                                }
                            }


                            var providersFound = searchForContentProviders(curActivity.javaFile());
                            if( providersFound ){
                                for (var i = 0; i < providersFound.length; i++) {
                                    r = AndroidRect( 10,10,providersFound[i],'contentProvider');
                                    curActivity.recsJava.add(r);


                                    App.ExistingProject.providers().forEach(function(element){
                                        if(element.nome() == providersFound[i]){
                                            element.linked(true);
                                        }
                                    });

                                    link = createUmlLink(r.id, curActivity.recs()[0].id, "association" );
                                    // curActivity.paper.graph.addCell(link);
                                    curActivity.recsJava.add(link);

                                    App.ExistingProject.updateDiagram();

                                }
                            }

                        }
                    );

                }

                reader.readAsText(file);


            } else {
                this.layoutFileUploaded(false);
                this.messages.javaFile("This is not a valid JAVA file.");
            }
        } else {
            this.messages.javaFile("Can't open file.");
        }
    },

    loadLayoutFile: function(evt){
        var file = document.getElementById("layoutFile"+this.nome()).files[
            0];
        var fileType = /\.xml$/;

        this.messages.layoutFile("");

        if (file) {

            if (file.name.match(fileType)) {
                var reader = new FileReader();
                var cb = function(data,filename) {
                    TEMP_FILE_CONTENT = data;
                    TEMP_FILE_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            var curActivity = this.App.ExistingProject.currentActivity;
                            curActivity.layoutFileUploaded(true);
                            curActivity.layoutFile(TEMP_FILE_CONTENT);
                            curActivity.parseLayoutForComponents();
                            this.App.ExistingProject.updateDiagram();
                        }
                    );

                }

                reader.readAsText(file);


            } else {
                this.layoutFileUploaded(false);
                this.messages.layoutFile("This is not a valid XML file.");
            }
        } else {
            this.messages.layoutFile("Can't open file.");
        }
    },

    parseLayoutTree: function(nodo, parent){
        var rectType = "noicon";
        if (layouts.indexOf(nodo.prop("tagName")) >= 0 ){
            rectType = "layout";
        }
        if (widgets.indexOf(nodo.prop("tagName")) >= 0){
            rectType = "widget";
        }
        var father = AndroidRect(
                    0,0,
                    nodo.attr("android:id") ?
                    nodo.attr("android:id").split('/').pop() : nodo.prop("tagName"),
                    rectType
                );
        this.recsLayout.add(father);

        var link = createUmlLink(father.id, parent.id, "association" );
        this.recsLayout.add(link);
        App.ExistingProject.updateDiagram();
        // this.paper.graph.addCell(link);

        var nodes = nodo.children('*');
        for(var i=0; i< nodes.length; i++){
            var n = $(nodes[i]);
            rectType = "noicon";

            if (layouts.indexOf(n.prop("tagName")) >= 0 ){
                rectType = "layout";
            }
            if (widgets.indexOf(n.prop("tagName")) >= 0){
                rectType = "widget";
            }

            var r = AndroidRect(
                    0,0,
                    n.attr("android:id") ?
                    n.attr("android:id").split('/').pop() : n.prop("tagName"),
                    rectType
                );

            this.recsLayout.add(r);


            // creo link,  r.id -----> father.id
            link = createUmlLink(r.id, father.id, "composition" );
            this.recsLayout.add(link);
            App.ExistingProject.updateDiagram();
            // this.paper.graph.addCell(link);

            // se il nodo ha figli...
            if(n.children().length > 0 ){
                this.parseLayoutTree(n.children('*'), r);
            }
        }


    },


    parseLayoutForComponents: function(){
        var xmlDoc = $.parseXML(this.layoutFile());
        var $xml = $(xmlDoc);
        var root = $xml.children().first();

        this.parseLayoutTree(root, this.recs()[0]);
    },


});

var Service = App.Model({
    nome: blocks.observable(),
    linked: blocks.observable(false),
});

var Provider = App.Model({
    nome : blocks.observable(),
    linked: blocks.observable(false),
});

var Receiver = App.Model({
    nome : blocks.observable(),
    linked: blocks.observable(false),
});


// Collections

var Activities = App.Collection(Activity);
var Services = App.Collection(Service);
var Providers = App.Collection(Provider);
var Receivers = App.Collection(Receiver);


/*
 *
 *  VIEWS
 *
 */

App.View('ExistingProject', {
    messages: Messages(),
    manifest: AndroidManifest(),

    activities : Activities(),
    currentActivity: Activity(),
    services : Services(),
    providers: Providers(),
    receivers: Receivers(),

    diagram : blocks.observable(),

    project: blocks.observable(""),
    projects: blocks.observable([]),


    activitiesEmpty: blocks.observable(function(){
        return this.activities().length == 0;
    }),
    servicesEmpty: blocks.observable(function(){
        return this.services().length == 0;
    }),
    providersEmpty: blocks.observable(function(){
        return this.providers().length == 0;
    }),
    receiversEmpty: blocks.observable(function(){
        return this.receivers().length == 0;
    }),
    projectsEmpty: blocks.observable(function(){
        return this.projects().length == 0;
    }),


    loadAndroidManifest: function(evt) {
        var file = document.getElementById("AndroidManifestUploadButton").files[
            0];

        if (file) {

            if (file.name === 'AndroidManifest.xml') {
                var reader = new FileReader();
                var cb = function(data,filename) {
                    TEMP_FILE_CONTENT = data;
                    TEMP_FILE_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            var view = this.App.ExistingProject;
                            view.storeManifest();
                            view.manifest.uploaded(true);

                            view.activities.removeAll();
                            view.services.removeAll();
                            view.providers.removeAll();
                            view.receivers.removeAll();

                            var listaAttivita = view.getComponent('activity');
                            for(var i=0; i< listaAttivita.length; i++){

                                var newActivity = Activity({
                                    nome: listaAttivita[i],
                                    // isAttiva:false,

                                });
                                newActivity.setAttiva();
                                view.activities.add(newActivity);
                                view.activities()[view.activities().length-1].setAttiva();
                            }

                            var listaServizi = view.getComponent('service');
                            listaServizi.forEach(function(e,i){
                                var newService = Service({
                                    nome : e,
                                });
                                view.services.add(newService);
                            });

                            var listaProviders = view.getComponent('provider');
                            for(var i=0; i< listaProviders.length; i++){

                                var newProvider = Provider({
                                    nome: listaProviders[i],

                                });

                                view.providers.add(newProvider);
                            }

                            var listaReceivers = view.getComponent('receiver');
                            for(i=0; i< listaReceivers.length; i++){

                                var newReceiver = Receiver({
                                    nome: listaReceivers[i],

                                });

                                view.receivers.add(newReceiver);
                            }



                            $('#androidManifestModal').closeModal();

                        }
                    );

                }

                reader.readAsText(file);

                console.log("Name: " + file.name + "\n" +
                    "Last Modified Date :" + file.lastModifiedDate
                );

            } else {
                this.messages.error("This is not a valid AndroidManifest file.");
            }
        } else {
            this.messages.error("Can't open file.");
        }


    },

     uploadAndroidManifest: function(evt) {
        this.loadAndroidManifest();
    },

    storeManifest: function(evt) {
        this.manifest.fileName(TEMP_FILE_NAME);
        this.manifest.fileContent(TEMP_FILE_CONTENT);
    },

    loadProjects: function(){
        if(typeof(Storage) !== "undefined") {


            var projArray = JSON.parse(localStorage.getItem("UMLAndroid-Projects"));
            if(projArray["projects"].length >= 1){
                this.projects.removeAll();
            }

            for(var t = 0; t < projArray["projects"].length; t++){

                // this.project(projArray["projects"][t]);
                // this.projects.add(this.project);

                this.projects.add(projArray["projects"][t]);
            }


        } else {
            console.log("No Web Storage support.");
        }
    },

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
                var elencoAttivita = this.activities();

                if(elencoAttivita.length > 0){
                    // cerca nell'elenco delle attivita se esiste gia un progetto con questo nome
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
                    for(var i = 0; i < elencoAttivita.length; i++){
                        var key = "UMLAndroid-" + this.project() + "-activity-" + elencoAttivita[i].nome();
                        console.dir(elencoAttivita[i].paper.graph.toJSON());
                        var value = JSON.stringify(elencoAttivita[i].paper.graph.toJSON());
                        localStorage.setItem(key, value);
                    }

                    // per ogni Service creo un'entry nel localStorage per salvare il suo stato
                    var elencoServices = this.services();
                    for(var i = 0; i < elencoServices.length; i++){
                        var key = "UMLAndroid-" + this.project() + "-service-" + elencoServices[i].nome();
                        var value = JSON.stringify({"nome":elencoServices[i].nome(),"linked":elencoServices[i].linked()});
                        localStorage.setItem(key, value);
                    }
                    // per ogni Broadcast Receiver creo un'entry nel localStorage per salvare il suo stato
                    var elencoReceivers = this.receivers();
                    for(var i = 0; i < elencoReceivers.length; i++){
                        var key = "UMLAndroid-" + this.project() + "-receiver-" + elencoReceivers[i].nome();
                        var value = JSON.stringify({"nome":elencoReceivers[i].nome(),"linked":elencoReceivers[i].linked()});
                        localStorage.setItem(key, value);
                    }
                    // per ogni Content Provider creo un'entry nel localStorage per salvare il suo stato
                    var elencoProviders = this.providers();
                    for(var i = 0; i < elencoProviders.length; i++){
                        var key = "UMLAndroid-" + this.project() + "-provider-" + elencoProviders[i].nome();
                        var value = JSON.stringify({"nome":elencoProviders[i].nome(),"linked":elencoProviders[i].linked()});
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

          if(projName == this.project()){
              console.log("progetto attualmente in uso");
              return;
          }else{
              var len = "UMLAndroid-".length + projName.length;


              this.project(projName);

              this.activities.removeAll();
              this.currentActivity.reset();
              this.services.removeAll();
              this.providers.removeAll();
              this.receivers.removeAll();

              this.manifest.reset();


            //   Crea le Activity a partire dai valori trovati nel localStorage
              for(var i = 0; i < localStorage.length; i++){
                  var l = len + "-activity-".length;

                  if(localStorage.key(i).substring(0,l) == "UMLAndroid-"+projName + "-activity-"){

                      var activityName = localStorage.key(i).substring(l);
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

              //   Crea i Services a partire dai valori trovati nel localStorage
                for(var i = 0; i < localStorage.length; i++){
                    var l = len + "-service-".length;

                    if(localStorage.key(i).substring(0,l) == "UMLAndroid-"+projName + "-service-"){

                        var serviceName = localStorage.key(i).substring(l);

                        var s = Service({
                            nome: serviceName,
                        });

                      // aggiorna l'elenco dei services
                      this.services.add(s);
                    }
                }

                var elencoServices = this.services();
                for(var i = 0; i < elencoServices.length; i++){
                    var service =JSON.parse(localStorage.getItem("UMLAndroid-"+projName+"-service-"+elencoServices[i].nome()));

                    elencoServices[i].linked(service.linked);

                }

                //   Crea i Broadcast Receivers a partire dai valori trovati nel localStorage
                  for(var i = 0; i < localStorage.length; i++){
                      var l = len + "-receiver-".length;

                      if(localStorage.key(i).substring(0,l) == "UMLAndroid-"+projName + "-receiver-"){

                          var receiverName = localStorage.key(i).substring(l);

                          var r = Receiver({
                              nome: receiverName,
                          });

                        // aggiorna l'elenco dei receivers
                        this.receivers.add(r);
                      }
                  }

                  var elencoReceivers = this.receivers();
                  for(var i = 0; i < elencoReceivers.length; i++){
                      var receiver =JSON.parse(localStorage.getItem("UMLAndroid-"+projName+"-receiver-"+elencoReceivers[i].nome()));

                      elencoReceivers[i].linked(receiver.linked);

                  }

                  //   Crea i Content Providers a partire dai valori trovati nel localStorage
                    for(var i = 0; i < localStorage.length; i++){
                        var l = len + "-provider-".length;

                        if(localStorage.key(i).substring(0,l) == "UMLAndroid-"+projName + "-provider-"){

                            var providerName = localStorage.key(i).substring(l);

                            var p = Provider({
                                nome: providerName,
                            });

                          // aggiorna l'elenco dei providers
                          this.providers.add(p);
                        }
                    }

                    var elencoProviders = this.providers();
                    for(var i = 0; i < elencoProviders.length; i++){
                        var provider =JSON.parse(localStorage.getItem("UMLAndroid-"+projName+"-provider-"+elencoProviders[i].nome()));

                        elencoProviders[i].linked(provider.linked);

                    }


              // visualizza la prima Activity
              elenco[0].setAttiva();
              $('.tooltipped').tooltip({delay: 0});
          }

      } else {
        console.log("No Web Storage support.");
      }

    },

    getComponent: function(component){
        var xmlDoc = $.parseXML(this.manifest.fileContent());
        var $xml = $(xmlDoc);
        var componentNameList = $xml.find(component);

        var names = [];

        componentNameList.each(function(){
            names.push($(this).attr("android:name").split('.').pop());
        });

        return names;
    },


    updateDiagram: function(){
        this.currentActivity.paper.graph.addCells(this.currentActivity.recs());
        this.currentActivity.paper.graph.addCells(this.currentActivity.recsJava());
        this.currentActivity.paper.graph.addCells(this.currentActivity.recsLayout());

        this.currentActivity.layoutDiagram();
        if(this.currentActivity.recs().length > 10){
            this.currentActivity.fitDiagram();
        }

    },



    openModalFromContextMenu: function(evt, parent){
        this.currentActivity.populateRecsName();
        $('select').material_select();

        switch(evt.target.textContent){

            case "Add Relation":
                if(this.currentActivity.recs().length >1){
                    $('#' + this.currentActivity.nome + 'NewCustomLinkModal').openModal();
                }else{
                    console.log("C'è solo un diagramma, impossibile aggiungere una relazione");
                }
                break;


            case "Add Custom Class":
                $('#' + this.currentActivity.nome + 'NewCustomClassModal').openModal();
                break;


            case "Add Android Component":
                $('#' + this.currentActivity.nome + 'NewAndroidComponentModal').openModal();
                break;
        }

    },
    openProjectModal: function(){
        this.loadProjects();
        $('select').material_select();
    },

    openAttachComponentModal: function(evt){
        $('select').material_select();

        var element = document.getElementById(evt.target.text+"AttachModal");
        $(element).openModal();
    },
    attachService: function(evt){
        var element = null;
        var rectName = evt.target.attributes.parentName.value;

        element = document.getElementById(rectName + 'UnattachedServiceRelationType');
        var relationType = $(element).find(":selected").attr('id');

        element = document.getElementById(rectName + 'UnattachedServiceParentName');
        var parentName = $(element).find(":selected").attr('id');

        //
        // var rect = AndroidRect(0,0, rectName, "service");
        //
        // searchArrayOfObj(this.activities(),"nome", parentName).setAttiva();
        //
        //
        // this.currentActivity.recs.add(rect);
        // this.updateDiagram();
        //
        //
        // var link = createUmlLink(rect.id, this.currentActivity.recs()[0],relationType);
        // this.currentActivity.paper.graph.addCell(link);
        //
        // searchArrayOfObj(this.services(),"nome",rectName).linked(true);
        // $('select').material_select();

        createAndroidComponent(this,rectName,"service",parentName,relationType);
        searchArrayOfObj(this.services(),"nome",rectName).linked(true);
        // $('select').material_select();
    },
    attachProvider: function(evt){
        var element = null;
        var rectName = evt.target.attributes.parentName.value;

        element = document.getElementById(rectName + 'UnattachedProviderRelationType');
        var relationType = $(element).find(":selected").attr('id');

        element = document.getElementById(rectName + 'UnattachedProviderParentName');
        var parentName = $(element).find(":selected").attr('id');

        createAndroidComponent(this,rectName,"contentProvider",parentName,relationType);
        searchArrayOfObj(this.providers(),"nome",rectName).linked(true);
    },
    attachReceiver: function(evt){
        broadcastReceiver
        var element = null;
        var rectName = evt.target.attributes.parentName.value;


        element = document.getElementById(rectName + 'UnattachedReceiverRelationType');
        var relationType = $(element).find(":selected").attr('id');

        element = document.getElementById(rectName + 'UnattachedReceiverParentName');
        var parentName = $(element).find(":selected").attr('id');

        createAndroidComponent(this,rectName,"broadcastReceiver",parentName,relationType);
        searchArrayOfObj(this.receivers(),"nome",rectName).linked(true);

    },

    addAndroidComponentTo: function(){
        createAndroidComponent(this);
    },

    addCustomClassTo: function(){
        createCustomClass(this);
    },

    addCustomLink: function(){
       createCustomLink(this);
    },

});
