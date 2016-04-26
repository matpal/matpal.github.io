$(document).ready(function() {

  $(".button-collapse").sideNav({
      menuWidth: 350,
  });

  //   Modal
  $('.modal-trigger').leanModal({
      dismissible: true,
      height: '100%',
  });
  // $('#androidManifestModal').openModal();

});

// Inizializza l'app JSBlocks
var App = blocks.Application();
var TEMP_FILE_CONTENT = "";
var TEMP_FILE_NAME = "";

/*
 *
 *  MODELS
 *
 */

// Modello AndroidManifest
// Rappresenta il file AndroidManifest.xml
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

// Modello Activity
// Rappresenta una activity del sistema Android
var Activity = App.Model({
    nome : blocks.observable(),
    id :  blocks.observable(),
    isAttiva: blocks.observable(false),  //indica se l'activity è quella visualizzata nella view
    messages: Messages(),
    paper: blocks.observable(),
    diagram: blocks.observable(),
    zoomLevel: blocks.observable(1),

    // recs: blocks.observable([]),
    recsLayout: blocks.observable([]), //array di diagrammi rappresentanti elementi di Layout
    recsJava: blocks.observable([]),   //array di diagrammi rappresentanti classi JAVA
    recsName: blocks.observable([]),   //array contenente i nomi dei diagrammi

    intents: blocks.observable([]),    //array di intents relativi all'activity

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

    // abilita/disabilita la visualizzazione dei diagrammi rappresentanti classi JAVA
    toggleJavaElements: function(){
        this.recsJava().forEach(function(element){
            if(element.attr('./display') === 'none'){
                element.attr('./display', 'block');
            }else{
                element.attr('./display', 'none');
            }
        });
    },

    // abilita/disabilita la visualizzazione dei diagrammi rappresentanti elementi di layout
    toggleLayoutElements: function(){
        this.recsLayout().forEach(function(element){
            if(element.attr('./display') === 'none'){
                element.attr('./display', 'block');
            }else{
                element.attr('./display', 'none');
            }
        });
    },

    // Aggiorna la lista dei nomi dei diagrammi
    populateRecsName: function(){
        this.recsName.removeAll();
        // for(var i = 0; i < this.recs().length; i++){
        //     //se non è un link lo aggiungo alla lista dei rettangoli con nomi
        //     if(!this.recs()[i].attributes.hasOwnProperty("target")){
        //         this.recsName.push(this.recs()[i]);
        //     }
        // }
        for(var i = 0; i < this.recsLayout().length; i++){
            //se l'elemento non è un link, viene aggiunto alla lista dei nomi dei diagrammi di layout
            if(!this.recsLayout()[i].attributes.hasOwnProperty("target")){
                this.recsName.push(this.recsLayout()[i]);
            }
        }
        for(var i = 0; i < this.recsJava().length; i++){
            //se l'elemento non è un link, viene aggiunto alla lista dei nomi dei diagrammi Java
            if(!this.recsJava()[i].attributes.hasOwnProperty("target")){
                this.recsName.push(this.recsJava()[i]);
            }
        }

    },

    populateRecsJava: function(){
        this.recsJava.removeAll();
        var elements = this.paper.graph.getCells();

        // aggiunge all'array dei diagrammi 'java' i diagrammi
        for(var i = 0; i < elements.length; i++){
            if(elements[i].attributes.hasOwnProperty('prop')){
                var t = elements[i].attributes.prop.data.type;
                if( t == 'activity' || t == 'service' || t == 'provider' || t == 'receiver' ||
                    t == 'explicitIntent'){
                        this.recsJava.add(elements[i]);
                }
            }
        }
        // aggiunge all'array dei diagrammi 'java' le relazioni
        for(var i = 0; i < elements.length; i++){
            if(elements[i].attributes.hasOwnProperty('source')){
                var idSource = elements[i].attributes.source.id;
                for(var j=0; j<this.recsJava().length; j++){
                    if(this.recsJava()[j].id == idSource){
                        this.recsJava.add(elements[i]);
                    }
                }
            }
        }

    },
    populateRecsLayout: function(){
        this.recsLayout.removeAll();
        var elements = this.paper.graph.getCells();

        // aggiunge all'array dei diagrammi 'layout' i diagrammi
        for(var i = 0; i < elements.length; i++){
            if(elements[i].attributes.hasOwnProperty('prop')){
                var t = elements[i].attributes.prop.data.type;
                if( t == 'layout' || t == 'widget'  ){
                    this.recsLayout.add(elements[i]);
                }
            }
        }
        // aggiunge all'array dei diagrammi 'layout' le relazioni
        for(var i = 0; i < elements.length; i++){
            if(elements[i].attributes.hasOwnProperty('source')){
                var idSource = elements[i].attributes.source.id;
                for(var j=0; j<this.recsLayout().length; j++){
                    if(this.recsLayout()[j].id == idSource){
                        this.recsLayout.add(elements[i]);
                    }
                }
            }
        }
    },

    // inizializza il paper che conterra' i diagrammi
    createPaper: function(){
        this.paper = ((this.paper instanceof MyPaper) ? this.paper : new MyPaper(document.getElementById(this.nome)));
    },

    // Crea il diagramma iniziale dell'activity
    createActivityDiagram: function(){
        if(this.paper instanceof MyPaper){
            var r = null;

            if(this.paper.graph.getCells().length == 0){
                // r = AndroidApp(0,0, this.nome(), 'activity',AndroidComponents["activity"].icon);
                r = AndroidRect(0,0, this.nome(), 'activity',AndroidComponents["activity"].icon);
                this.id(r.attributes.id);
                this.recsJava.add(r);

                $(window).on('resize', function(){
                    App.ModelingActivities.currentActivity.paper.paper.setDimensions( window.innerWidth * 0.75, 500);
                });
            }
            for(var i = 0; i < this.intents().length; i++){

                var rect = AndroidRect(0,0, this.intents()[i], "explicitIntent",AndroidComponents["explicitIntent"].icon);
                this.recsJava.add(rect);

                App.ModelingActivities.updateDiagram();

                var link = createUmlLink(rect.id, r.id, "association" );
                // this.paper.graph.addCell(link);
                this.recsJava.add(link);
                App.ModelingActivities.updateDiagram();

            }
        }

        // $('.tooltipped').tooltip({delay: 0});
        // location.href = '#' + this.nome;
    },

    // initActivity: function(){
    //     if(this.paper == 'undefined'){
    //         this.createPaper();
    //         this.createActivityDiagram();
    //         App.ModelingActivities.currentActivity = this;
    //         App.ModelingActivities.updateDiagram();
    //     }
    //
    // },

    // Rende attiva l'activity e visualizza il corrispondente diagramma
    setAttiva: function(){
        var activityNames = App.ModelingActivities.activities;
        for(var i=0; i< activityNames().length; i++){
            if(activityNames()[i].isAttiva()){
                activityNames()[i].toggleAttiva();
            }
        }

        this.toggleAttiva();
        App.ModelingActivities.currentActivity = this;

        // if(this.recsJava().length == 0){
        if(this.paper == 'undefined'){
            this.createPaper();
            // this.createActivityDiagram();
            this.createActivityDiagram();
            App.ModelingActivities.currentActivity = this;
            App.ModelingActivities.updateDiagram();
        }else{
            App.ModelingActivities.currentActivity = this;
        }

    },

    // Visualizza un menu contestuale grazie al plugin contextmenu
    // Le relazioni possono essere inserite solo quando ci sono due o piu' diagrammi
    showMenu: function(){
      var fn = App.ModelingActivities.openModalFromContextMenu;
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

});

// Modello Service
// Rappresenta il componente 'service' dei sistemi Android
var Service = App.Model({
    nome: blocks.observable(),
    linked: blocks.observable(false),
    intents: blocks.observable([]),
});

// Modello Provider
// Rappresenta il componente 'content provider' dei sistemi Android
var Provider = App.Model({
    nome : blocks.observable(),
    linked: blocks.observable(false),
});

// Modello Receiver
// Rappresenta il componente 'broadcast receiver' dei sistemi Android
var Receiver = App.Model({
    nome : blocks.observable(),
    linked: blocks.observable(false),
    intents: blocks.observable([]),
});


// Modello Permission
// Rappresenta una permission del dominio Android, ossia un permesso che l'app necessita
// per il suo corretto funzionamento
var Permission = App.Model({
    name: App.Property({
        validateOnChange: false,

        validate: function(value){
            if(permissionsSet.indexOf(value) != -1){
                return true;
            }else{
                return 'Permission not found.'
            }
        }
    }),

    editing: blocks.observable(false),
    toggleEdit: function(){
        this.editing(!this.editing());
    },

    remove: function() {
        this.destroy(true);
    }
});

// Collections
var Activities = App.Collection(Activity);
var Services = App.Collection(Service);
var Providers = App.Collection(Provider);
var Receivers = App.Collection(Receiver);
var Permissions = App.Collection(Permission);


// Modello AndroidApplication
// Rappresenta l'applicazione android ad alto livello, raccoglie informazioni generali
var AndroidApplication = App.Model({
    applicationName: App.Property({
        defaultValue: "",
    }),
    packageName: App.Property({
        defaultValue: "",
    }),
    minSdk: App.Property({
        defaultValue: 1
    }),
    maxSdk: App.Property({
        defaultValue: 23
    }),
    targetSdk: App.Property({
        defaultValue: 23
    }),
    permission: Permission(),
    permissions: Permissions(),
});




/*
 *
 *  VIEW
 *
 */
 // Vista ModelingActivities
 // Raccoglie la vista e il funzionamento dell'interfaccia per la modellazione delle activities
App.View('ModelingActivities', {
    messages: Messages(),
    manifest: AndroidManifest(),                // modello del manifest
    manifestDocumentTree: blocks.observable(),  // rappresentazione ad albero del manifest
    // applicationName: blocks.observable(""),
    // appplicationPackage: blocks.observable(""),

    activities : Activities(),                  // elenco di activities
    currentActivity: Activity(),                // activity in primo piano nella modellazione
    services : Services(),                      // elenco di services
    providers: Providers(),                     // elenco di content providers
    receivers: Receivers(),                     // elenco di broadcast receivers

    diagram : blocks.observable(),              // rappresenta il riquadro contenente i diagrammi

    project: blocks.observable(""),             // nome del progetto
    projects: blocks.observable([]),            // array contenenti i nomi dei progetti

    androidApplication: AndroidApplication({}),

    // controlla se sono presenti activities
    activitiesEmpty: blocks.observable(function(){
        return this.activities().length == 0;
    }),
    // controlla se sono presenti services
    servicesEmpty: blocks.observable(function(){
        return this.services().length == 0;
    }),
    // controlla se sono presenti content providers
    providersEmpty: blocks.observable(function(){
        return this.providers().length == 0;
    }),
    // controlla se sono presenti broadcast receivers
    receiversEmpty: blocks.observable(function(){
        return this.receivers().length == 0;
    }),
    // controlla se ci sono progetti salvati
    projectsEmpty: blocks.observable(function(){
        return this.projects().length == 0;
    }),
    // controlla se sono state richieste delle permissions
    permissionsEmpty: blocks.observable(function(){
        return this.androidApplication.permissions().length == 0;
    }),


    // Legge il contenuto del file AndroidManifest.xml, crea le activities necessarie e gli elementi
    // trovati nel manifest
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
                            var view = this.App.ModelingActivities;
                            view.storeManifest();
                            view.manifest.uploaded(true);

                            view.activities.removeAll();
                            view.services.removeAll();
                            view.providers.removeAll();
                            view.receivers.removeAll();




                            var listaAttivita = view.getComponent('activity');
                            for(var i=0; i< listaAttivita.length; i++){

                                var newActivity = Activity({
                                    nome: listaAttivita[i].parentName,
                                    // isAttiva:false,
                                    intents: listaAttivita[i].intents,

                                });
                                // newActivity.initActivity();
                                newActivity.createPaper();
                                newActivity.setAttiva();
                                view.activities.add(newActivity);
                                view.activities()[view.activities().length-1].setAttiva();
                            }

                            var listaServizi = view.getComponent('service');
                            listaServizi.forEach(function(data,i){
                                var newService = Service({
                                    nome : data.parentName,
                                    intents: data.intents,
                                });

                                view.services.add(newService);
                            });

                            var listaProviders = view.getComponent('provider');
                            for(var i=0; i< listaProviders.length; i++){

                                var newProvider = Provider({
                                    nome: listaProviders[i].parentName,

                                });

                                view.providers.add(newProvider);
                            }

                            var listaReceivers = view.getComponent('receiver');
                            for(i=0; i< listaReceivers.length; i++){

                                var newReceiver = Receiver({
                                    nome: listaReceivers[i].parentName,
                                    intents: listaReceivers[i].intents,
                                });

                                view.receivers.add(newReceiver);
                            }


                            view.androidApplication.packageName(
                                $(App.ModelingActivities.ManifestDocumentTree).find('manifest').attr('package')
                            );
                            view.androidApplication.applicationName(
                                $(App.ModelingActivities.ManifestDocumentTree).find('application').attr('android:name')
                            );

                            var apiLvls = $(App.ModelingActivities.ManifestDocumentTree).find('uses-sdk');

                            view.androidApplication.minSdk(apiLvls.attr('android:minSdkVersion'));
                            view.androidApplication.maxSdk(apiLvls.attr('android:maxSdkVersion'));
                            view.androidApplication.targetSdk(apiLvls.attr('android:targetSdkVersion'));

                            var permissions = view.getComponent('uses-permission');
                            for(var i=0; i<permissions.length; i++){
                                view.androidApplication.permission.name(permissions[i].parentName);
                                view.androidApplication.permissions.add(view.androidApplication.permission);
                            }


                            $('#androidManifestModal').closeModal();
                            this.project="";
                            // $('#projectNameInput').val("");
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

    // funzione di utilita' per la memorizzazione del manifest
    storeManifest: function(evt) {
        this.manifest.fileName(TEMP_FILE_NAME);
        this.manifest.fileContent(TEMP_FILE_CONTENT);
    },

    // Apre la finestra di dialogo per la selezione del progetto che si vuole caricare in memoria
    loadProjects: function(){
        if(typeof(Storage) !== "undefined") {


            var projArray = JSON.parse(localStorage.getItem("UMLAndroid-ActivitiesProjects"));
            if(projArray["projects"].length >= 1){
                this.projects.removeAll();
            }

            for(var t = 0; t < projArray["projects"].length; t++){

                this.projects.add(projArray["projects"][t]);
            }


        } else {
            console.log("No Web Storage support.");
        }
    },

    // Salva nel local storage le activities modellate
    saveToJSON: function(){
        if(typeof(Storage) !== "undefined") {

            this.project(this.androidApplication.applicationName());

            if(this.project() != '' || this.project() != 'undefined' ){

                var messaggio = "";

                // Verifica che sia presente nel local storage la voce contenente i nomi
                // dei progetti.
                // carica l'elenco dei nomi dei progetti o crea l'entry nel localStorage
                var projArray = JSON.parse(localStorage.getItem("UMLAndroid-ActivitiesProjects"));
                if(!projArray){
                    projArray = {
                        "projects": []
                    };
                    localStorage.setItem("UMLAndroid-ActivitiesProjects", JSON.stringify(projArray));
                }

                // carica elenco delle activity
                var elencoAttivita = this.activities();

                if(elencoAttivita.length > 0){

                    // cerca nell'elenco dei progetti se esiste gia un progetto con questo nome
                    // se il progetto non è presente...
                    if(projArray["projects"].indexOf(this.project()) === -1){
                        // aggiungo il progetto alla lista Progetti
                        projArray["projects"].push(this.project());
                        localStorage.setItem("UMLAndroid-ActivitiesProjects", JSON.stringify(projArray));
                    }
                    // se esiste già un progetto con questo nome, sovrascrivo
                    else if (projArray["projects"].indexOf(this.project()) > -1){
                        messaggio = "Progetto sovrascritto.";
                    }

                        // creo elenco delle activities
                        // Procedura necessaria per evitare riferimenti circolari in JSON
                        var a = [];
                        for(var i = 0; i < this.activities().length; i++){
                            var temp = this.activities()[i];
                            var formattedActivity= {
                                nome: temp.nome(),
                                diagram: temp.paper.graph.toJSON(),
                                intents: temp.intents(),
                            };
                            a.push(formattedActivity);
                        }

                        // creo elenco dei services
                        // Procedura necessaria per evitare riferimenti circolari in JSON
                        var s = [];
                        for(var i = 0; i < this.services().length; i++){
                            var temp = this.services()[i];
                            var formattedService = {
                                nome: temp.nome(),
                                linked: temp.linked(),
                                intents: temp.intents(),
                            };
                            s.push(formattedService);
                        }

                        // creo elenco dei content providers
                        // Procedura necessaria per evitare riferimenti circolari in JSON
                        var p = [];
                        for(var i = 0; i < this.providers().length; i++){
                            var temp = this.providers()[i];
                            var formattedProvider = {
                                nome: temp.nome(),
                                linked: temp.linked(),
                            };
                            p.push(formattedProvider);
                        }

                        // creo elenco dei broadcast receivers
                        // Procedura necessaria per evitare riferimenti circolari in JSON
                        var r = [];
                        for(var i = 0; i < this.receivers().length; i++){
                            var temp = this.receivers()[i];
                            var formattedReceiver = {
                                nome: temp.nome(),
                                linked: temp.linked(),
                                intents: temp.intents(),
                            };
                            r.push(formattedReceiver);
                        }

                        // crea elenco delle permissions
                        // Procedura necessaria per evitare riferimenti circolari in JSON
                        var perms = [];
                        for(var i = 0; i < this.androidApplication.permissions().length; i++){
                            var temp = this.androidApplication.permissions()[i];
                            var formattedPermission = {
                                name: temp.name(),

                            };
                            perms.push(formattedPermission);
                        }

                        var appInfos = {
                            applicationName: this.androidApplication.applicationName(),
                            packageName: this.androidApplication.packageName(),
                            minSdk: this.androidApplication.minSdk(),
                            maxSdk: this.androidApplication.maxSdk(),
                            targetsdk: this.androidApplication.targetSdk(),
                            permissions: perms,
                            activities: a,
                            services: s,
                            providers: p,
                            receivers: r,
                        };

                        localStorage.setItem("UMLAndroid-Activities-"+this.androidApplication.applicationName(), JSON.stringify(appInfos));

                        messaggio = "Progetto salvato.";




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

    // Carica dal local storage il progetto selezionato
    loadFromJSON: function(){
      if(typeof(Storage) !== "undefined") {
          var projName = $('#projectName').find(":selected").attr('id');

          if(projName == this.project()){
              console.log("progetto attualmente in uso");
              return;
          }else{
            //   var len = "UMLAndroid-".length + projName.length;


              this.project(projName);

              this.activities.removeAll();
              this.currentActivity.reset();
              this.services.removeAll();
              this.providers.removeAll();
              this.receivers.removeAll();

            //   this.manifest.reset();
              this.manifest.uploaded(false);
              this.manifest.fileName("");
              this.manifest.fileContent("");
              $('#AndroidManifestUploadButton').val('');


              var project = JSON.parse(localStorage.getItem("UMLAndroid-Activities-" + this.project()));
              console.dir(project);

              this.androidApplication.applicationName(project["applicationName"]);
              this.androidApplication.packageName(project["packageName"]);
              this.androidApplication.minSdk(project["minSdk"]);
              this.androidApplication.maxSdk(project["maxSdk"]);
              this.androidApplication.targetSdk(project["targetSdk"]);
              this.androidApplication.permissions.addMany(project["permissions"]);

            //   this.activities.addMany(project["activities"]);
              for(var i = 0; i< project["activities"].length; i++){

                var a = Activity({
                    nome: project["activities"][i].nome,
                });
                // a.setAttiva();
                this.activities.add(a);

                // a.intents.addMany(project["activities"][i]["intents"]);

                // a.paper.graph.fromJSON(project["activities"][i].diagram);

                // console.log("cellule: ");
                // console.log(a.paper.graph.getCells());
                //
                // console.log("after");
                // console.log(this.activities()[this.activities().length-1].paper.graph.getCells());
                var elenco = this.activities();
                for(var j = 0; j < elenco.length; j++){
                  if(elenco[j].nome() ==  project["activities"][i].nome ){
                    // elenco[j].initActivity();
                    elenco[j].setAttiva();
                    elenco[j].paper.graph.fromJSON(project["activities"][i].diagram);
                    elenco[j].populateRecsJava();
                    elenco[j].populateRecsLayout();

                  }
                }

              }


              this.services.addMany(project["services"]);
              this.providers.addMany(project["providers"]);
              this.receivers.addMany(project["receivers"]);


            //   var diagrams = project["diagram"].cells;

            //   for(var i = 0; i < diagrams.length; i++){
            //       if(!diagrams[i].hasOwnProperty("target")){
            //         if(diagrams[i].prop.data.type == 'activity'){
            //             var a = Activity({
            //                 nome: diagrams[i].name,
            //             });
            //             this.activities.add(a);
            //         }
              //
              //
            //       }
              //
            //   }



            // //   Crea le Activity a partire dai valori trovati nel localStorage
            //   for(var i = 0; i < localStorage.length; i++){
            //       var l = len + "-activity-".length;
            //
            //       if(localStorage.key(i).substring(0,l) == "UMLAndroid-"+projName + "-activity-"){
            //
            //           var activityName = localStorage.key(i).substring(l);
            //           this.currentActivity = Activity({
            //               nome: activityName
            //           });
            //
            //         // aggiorna l'elenco delle activities
            //         this.activities.add(this.currentActivity);
            //       }
            //   }
            //
            //   var elenco = this.activities();
            //   for(var i = 0; i < elenco.length; i++){
            //       elenco[i].createPaper();
            //       elenco[i].setAttiva();
            //       elenco[i].paper.graph.fromJSON(JSON.parse(localStorage.getItem("UMLAndroid-"+projName+"-activity-"+elenco[i].nome())));
            //       elenco[i].recsJava.removeAll();
            //       elenco[i].recsJava.addMany(elenco[i].paper.graph.getCells());
            //   }
            //
            //   //   Crea i Services a partire dai valori trovati nel localStorage
            //     for(var i = 0; i < localStorage.length; i++){
            //         var l = len + "-service-".length;
            //
            //         if(localStorage.key(i).substring(0,l) == "UMLAndroid-"+projName + "-service-"){
            //
            //             var serviceName = localStorage.key(i).substring(l);
            //
            //             var s = Service({
            //                 nome: serviceName,
            //             });
            //
            //           // aggiorna l'elenco dei services
            //           this.services.add(s);
            //         }
            //     }
            //
            //     var elencoServices = this.services();
            //     for(var i = 0; i < elencoServices.length; i++){
            //         var service =JSON.parse(localStorage.getItem("UMLAndroid-"+projName+"-service-"+elencoServices[i].nome()));
            //
            //         elencoServices[i].linked(service.linked);
            //
            //     }
            //
            //     //   Crea i Broadcast Receivers a partire dai valori trovati nel localStorage
            //       for(var i = 0; i < localStorage.length; i++){
            //           var l = len + "-receiver-".length;
            //
            //           if(localStorage.key(i).substring(0,l) == "UMLAndroid-"+projName + "-receiver-"){
            //
            //               var receiverName = localStorage.key(i).substring(l);
            //
            //               var r = Receiver({
            //                   nome: receiverName,
            //               });
            //
            //             // aggiorna l'elenco dei receivers
            //             this.receivers.add(r);
            //           }
            //       }
            //
            //       var elencoReceivers = this.receivers();
            //       for(var i = 0; i < elencoReceivers.length; i++){
            //           var receiver =JSON.parse(localStorage.getItem("UMLAndroid-"+projName+"-receiver-"+elencoReceivers[i].nome()));
            //
            //           elencoReceivers[i].linked(receiver.linked);
            //
            //       }
            //
            //       //   Crea i Content Providers a partire dai valori trovati nel localStorage
            //         for(var i = 0; i < localStorage.length; i++){
            //             var l = len + "-provider-".length;
            //
            //             if(localStorage.key(i).substring(0,l) == "UMLAndroid-"+projName + "-provider-"){
            //
            //                 var providerName = localStorage.key(i).substring(l);
            //
            //                 var p = Provider({
            //                     nome: providerName,
            //                 });
            //
            //               // aggiorna l'elenco dei providers
            //               this.providers.add(p);
            //             }
            //         }
            //
            //         var elencoProviders = this.providers();
            //         for(var i = 0; i < elencoProviders.length; i++){
            //             var provider =JSON.parse(localStorage.getItem("UMLAndroid-"+projName+"-provider-"+elencoProviders[i].nome()));
            //
            //             elencoProviders[i].linked(provider.linked);
            //
            //         }
            //
            //
            //   // visualizza la prima Activity
            //   elenco[0].setAttiva();
            //   $('.tooltipped').tooltip({delay: 0});
          }

      } else {
        console.log("No Web Storage support.");
      }

    },
    getManifestDocumentTree: function(){
      this.ManifestDocumentTree = $.parseXML(this.manifest.fileContent());
    },

    // funzione di utilita' per la ricerca di un componente all'interno del manifest
    getComponent: function(component){
      if(!this.ManifestDocumentTree){
        this.getManifestDocumentTree();
      }
        // var xmlDoc = $.parseXML(this.manifest.fileContent());
        var $xml = $(this.ManifestDocumentTree);
        var componentNameList = $xml.find(component);

        var names = [];

        componentNameList.each(function(){
            var temp = {};
            temp.parentName = "" || $(this).attr("android:name").split('.').pop();
            temp.intents = [];
            var intentsFound = $(this).find('intent-filter');
            if(intentsFound.length > 0){
                for(var j = 0; j< intentsFound.length; j++){
                    temp.intents.push($(intentsFound[j]).find('action').attr("android:name"));
                }
            }

            names.push(temp);
        });

        return names;
    },

    // Aggiorna il paper dell'activity attiva con i diagrammi Java e di Layout e li ridispone
    updateDiagram: function(){
        // this.currentActivity.paper.graph.addCells(this.currentActivity.recs());
        this.currentActivity.paper.graph.addCells(this.currentActivity.recsJava());
        this.currentActivity.paper.graph.addCells(this.currentActivity.recsLayout());

        this.currentActivity.layoutDiagram();
        if(this.currentActivity.recsJava().length + this.currentActivity.recsLayout().length  > 10){
            this.currentActivity.fitDiagram();
        }

    },

    // Attiva/disattiva il riquadro per la visualizzazione delle informazioni dell'applicazione
    toggleSummaryApplicationSection: function(){
        // slideToggle non funziona correttamente, c'è un movimento laterale
        // che non dovrebbe esserci
        $('#applicationSummarySection').fadeToggle();
    },

    // Visualizza la finestra di dialogo corrispondente alla selezione del menu contestuale
    openModalFromContextMenu: function(evt, parent){
        this.currentActivity.populateRecsName();
        $('select').material_select();

        var numOfRect = this.currentActivity.recsLayout().length +
            this.currentActivity.recsJava().length;
        switch(evt.target.textContent){

            case "Add Relation":
                if(numOfRect >1){
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

    //Visualizza la finestra di dialogo per caricare un progetto
    openProjectModal: function(){
        this.loadProjects();
        $('select').material_select();
    },

    // Visualizza la finestra di dialogo per collegare un componente a un'activity
    openAttachComponentModal: function(evt){
        $('select').material_select();

        var element = document.getElementById(evt.target.text+"AttachModal");
        $(element).openModal();
    },

    // Collega un service a un'activity
    // Le informazioni necessarie vengono prelevate dalla form presentata all'utente
    attachService: function(evt){
        var element = null;
        var rectName = evt.target.attributes.parentName.value;

        element = document.getElementById(rectName + 'UnattachedServiceRelationType');
        var relationType = $(element).find(":selected").attr('id');

        element = document.getElementById(rectName + 'UnattachedServiceParentName');
        var parentName = $(element).find(":selected").attr('id');

        var serviceRect = createAndroidComponent(this,rectName,"service",parentName,relationType);

        var s = searchArrayOfObj(this.services(),"nome",rectName);
        s.linked(true);
        for(var i = 0; i < s.intents().length; i++){

            // createAndroidComponent(this, s.intents()[i], "explicitIntent", serviceRect.rect.id, "association");
            var rect = AndroidRect(0,0, s.intents()[i], "explicitIntent",AndroidComponents["explicitIntent"].icon);
            this.currentActivity.recsJava.add(rect);

            this.updateDiagram();

            var link = createUmlLink(rect.id, serviceRect.rect.id, "association" );
            // this.currentActivity.paper.graph.addCell(link);
            this.currentActivity.recsJava.add(link);
            this.updateDiagram();
        }

    },
    // Collega un content provider a un'activity
    // Le informazioni necessarie vengono prelevate dalla form presentata all'utente
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
    // Collega un broadcast receiver a un'activity
    // Le informazioni necessarie vengono prelevate dalla form presentata all'utente
    attachReceiver: function(evt){
        broadcastReceiver
        var element = null;
        var rectName = evt.target.attributes.parentName.value;


        element = document.getElementById(rectName + 'UnattachedReceiverRelationType');
        var relationType = $(element).find(":selected").attr('id');

        element = document.getElementById(rectName + 'UnattachedReceiverParentName');
        var parentName = $(element).find(":selected").attr('id');

        // createAndroidComponent(this,rectName,"broadcastReceiver",parentName,relationType);
        // searchArrayOfObj(this.receivers(),"nome",rectName).linked(true);

        var receiverRect = createAndroidComponent(this,rectName,"broadcastReceiver",parentName,relationType);

        var r = searchArrayOfObj(this.receivers(),"nome",rectName);
        r.linked(true);
        for(var i = 0; i < r.intents().length; i++){

            var rect = AndroidRect(0,0, r.intents()[i], "explicitIntent",AndroidManifestComponents["intentFilter"].icon);
            this.currentActivity.recsJava.add(rect);

            this.updateDiagram();

            var link = createUmlLink(rect.id, receiverRect.rect.id, "association" );
            // this.currentActivity.paper.graph.addCell(link);
            this.currentActivity.recsJava.add(link);
            this.updateDiagram();
        }

    },

    // Aggiunge un diagramma di tipo Android al paper
    // Le informazioni necessarie vengono prelevate dalla form presentata all'utente
    addAndroidComponentTo: function(){
        createAndroidComponent(this);
        var myRectType = $('#' + this.currentActivity.nome() + 'ComponentType').find(":selected").attr('id');
        var myRectName = $('#' + this.currentActivity.nome() + 'ComponentName').val();

        switch(myRectType){
            case "service":
                var s = Service({
                    nome: myRectName,
                    linked: true,
                    intents: []
                });
                this.services.add(s);
                break;
            case "contentProvider":
                var p = Provider({
                    nome:myRectName,
                    linked: true
                });
                this.providers.add(p);
                break;
            case "broadcastReceiver":
                var r = Receiver({
                    nome: myRectName,
                    linked: true,
                    intents: []
                });
                this.receivers.add(r);
                break;
        }
    },

    addCustomClassTo: function(){
        createCustomClass(this);
    },

    addCustomLink: function(){
       createCustomLink(this);
    },

    // Crea i file sorgente dell'applicazione Android
    generateCode: function(){

        var root = new JSZip();
        root.file("AndroidManifest.xml", this.manifest.fileContent());
        var res = root.folder("res");
        res.folder("drawable-hdpi");
        var layout = res.folder("layout");

        /*
        var elencoActivities = this.activities();
        for(var i=0; i< elencoActivities.length; i++){
            for(var j=0; j< elencoActivities[i].recsLayout().length; j++){
                //Cerco i vicini del rettangolo activity tra i recsLayout, prendo solo il primo,
                //che deve essere di tipo layout, e lo inserisco nel file di layout
            }

        }
        */

        // per ogni activity prendi il diagramma di layout, parsa il diagramma e genera i tag
        // var elencoActivities = this.activities();
        // for(var i = 0; i < elencoActivities.length; i++){
        //     var layoutFileContent = '<?xml version="1.0" encoding="utf-8"?>\n\n';
        //     var layoutRecList = elencoActivities[i].recsLayout();
        //
        //     function parsaVicini(radice,attivita){
        //         if(radice.attributes.prop){
        //             if(radice.attributes.prop.data.type=='widget'){
        //                 layoutFileContent+= '<'+radice.attributes.name + '>\n';
        //                 layoutFileContent+= '</'+radice.attributes.name + '>\n';
        //             }else if(radice.attributes.prop.data.type=='layout'){
        //                 layoutFileContent+= '<'+radice.attributes.name + '>\n';
        //                 // var children = attivita.paper.graph.getNeighbors(radice);
        //                 // for(var i = 0; i < children.length; i++){
        //                 //     if(children[i].attributes.prop.data.type == '')
        //                 //     parsaVicini(children[i],attivita);
        //                 // }
        //
        //                 layoutFileContent+= '</'+radice.attributes.name + '>\n';
        //             }
        //         }
        //     }
        //
        //     for(var j= 0; j < layoutRecList.length; j++){
        //         console.dir(layoutRecList[j]);
        //         if(layoutRecList[j].attributes.prop){
        //             if(layoutRecList[j].attributes.prop.data.type=='layout'){
        //
        //                 layoutFileContent+= '<'+layoutRecList[j].attributes.name + '>';
        //                 var vicini = elencoActivities[i].paper.graph.getNeighbors(layoutRecList[j]);
        //                 for(var z = 0; z < vicini.length; z++){
        //                     if(vicini[z].attributes.prop.data.type=='widget'){
        //                         layoutFileContent+= '\n\t<'+vicini[z].attributes.name + '>\n';
        //                         layoutFileContent+= '\n\t</'+vicini[z].attributes.name + '>\n';
        //                     }else if(vicini[z].attributes.prop.data.type=='layout'){
        //                         layoutFileContent+= '<'+vicini[z].attributes.name + '>\n';
        //                         // parsaVicini(vicini[z],elencoActivities[i]);
        //                         layoutFileContent+= '</'+vicini[z].attributes.name + '>\n';
        //                     }
        //                 }
        //                 layoutFileContent+= '</'+layoutRecList[j].attributes.name + '>\n';
        //
        //             }
        //         }
        //     }
        //     console.log(layoutFileContent);
        // }

        for(var i = 0; i< this.activities().length; i++){
            var nome = this.activities()[i].nome();
            layout.file(nome+'.xml', generateXmlLayoutFile(nome+'_mainLayout'));
        }
        //layout.file("test.xml",xmlLayoutFile["intestazione"]);

        res.folder("drawable");
        res.folder("menu");
        res.folder("mipmap");
        res.folder("values");

        var javaFolder = root.folder("java");
        // Genera la struttura delle cartelle basandosi sul package name
        var folderStructure = this.androidApplication.packageName().split('.');
        var javaSrc = javaFolder.folder(folderStructure.join('/'));
        var packageName = this.androidApplication.packageName();

        // per ogni activity creo un file .java
        var activityList = this.activities();
        for(var i = 0; i < activityList.length; i++){
            javaSrc.file(activityList[i].nome() + ".java",
                generateActivityClassFile(packageName,
                                          activityList[i].nome()
                                       ));
        }
        // per ogni service creo un file .java
        var serviceList = this.services();
        for(var i = 0; i < serviceList.length; i++){
            javaSrc.file(serviceList[i].nome() + ".java",
                generateServiceClassFile(packageName,
                                         serviceList[i].nome()
                                     ));
        }
        // per ogni content provider creo un file .java
        var providerList = this.providers();
        for(var i = 0; i < providerList.length; i++){
            javaSrc.file(providerList[i].nome() + ".java",
                generateContentProviderClassFile(packageName,
                                                 providerList[i].nome()
                                             ));
        }
        // per ogni broadcast receiver creo un file .java
        var receiverList = this.receivers();
        for(var i = 0; i < receiverList.length; i++){
            javaSrc.file(receiverList[i].nome() + ".java",
                generateReceiverClassFile(this.androidApplication.packageName(),
                                          receiverList[i].nome()
                                          ));
        }


        // Blob
        if (JSZip.support.blob) {
            try {
                var blob = root.generate({type:"blob"});
                // see FileSaver.js
                saveAs(blob, "GeneratedCode.zip");
            } catch(e) {
                console.log(e);
            }

        } else {
            console.log("(Download zip file not supported on this browser)");
        }
    },
});
