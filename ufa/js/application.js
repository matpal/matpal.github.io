$(document).ready(function(){
    // Supporto per l'autocomplete per le permissions tramite libreria Awesomplete
    var elem = document.getElementById('permissionInputEditApplication');

    var awesompletePermissionsNewApplication = new Awesomplete(elem,{
        list: permissionsSet,
    });

    // Inizalizzazione finestre di dialogo
    $('.modal-trigger').leanModal({
        dismissible: true,
        height: '100%',
        complete: function(){
            $('.lean-overlay').remove();
        }
    });

});

// Inizializza l'app JSBlocks
var App = blocks.Application();

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

// Permissions rappresenta un insieme di Permission
var Permissions = App.Collection(Permission);

// Modello AndroidApplication
// Rappresenta l'applicazione android ad alto livello, raccoglie informazioni necessarie per
// la costruzione del file manifest
var AndroidApplication = App.Model({
    applicationName: App.Property({
        required: "Application name is required",
        validateOnChange: true,
        change: function(){
            App.ModelingApplication.updateApplicationName();
        }
    }),
    packageName: App.Property({
        required: "Package name is required",
        validateOnChange: true
    }),
    minSdk: App.Property({
        defaultValue:1
    }),
    maxSdk: App.Property({
        defaultValue:23
    }),
    targetSdk: App.Property({
        defaultValue:11,
    }),
    permission: Permission(),
    permissions: Permissions(),
});

// Vista ModelingApplication
// Raccoglie la vista e il funzionamento dell'interfaccia per la modellazione dell'applicazione Android
App.View('ModelingApplication',{
    zoomLevel: blocks.observable(1),
    paper: blocks.observable(),                 // rappresenta il riquadro contenente i diagrammi
    recsName: blocks.observable([]),            // array contenenti i nomi dei diagrammi
    recs: blocks.observable([]),                // array di diagrammi
    startingDiagram: blocks.observable(false),  // boolean, tiene traccia della creazione del diagramma
    project: blocks.observable(""),             // nome del progetto
    projects: blocks.observable([]),            // array contenenti i nomi dei progetti

    androidApplication: AndroidApplication({}),

    init: function(){
        this.androidApplication.validate();
    },

    // aggiorna il nome dell'applicazione nel diagramma quando viene modificato
    updateApplicationName: function(){
        if(this.androidApplication.applicationName.valid()){
            if(this.recs().length >= 1){

                // aggiorna il nome
                this.recs()[0].prop('name',this.androidApplication.applicationName());
                // ridimensiona il diagramma
                this.recs()[0].resize(100 + this.androidApplication.applicationName().length * 10,
                    this.recs()[0].attributes.size.height);

                // aggiorna l'array contenente i nomi dei diagrammi
                this.populateRecsName();
            }
        }
        else{
            console.log(this.androidApplication.validationErrors());
        }
    },

    // Attiva/disattiva il riquadro per la modifica delle informazioni dell'applicazione
    toggleEditApplicationSection: function(){
        $('#applicationSummarySection').hide();
        $('#applicationEditSection').slideToggle();
    },
    // Attiva/disattiva il riquadro per la visualizzazione delle informazioni dell'applicazione
    toggleSummaryApplicationSection: function(){
        $('#applicationEditSection').hide();
        $('#applicationSummarySection').slideToggle();
    },

    // controlla se sono state richieste delle permissions
    permissionsEmpty: blocks.observable(function(){
        return this.androidApplication.permissions().length == 0;
    }),

    // controlla se ci siano progetti salvati
    projectsEmpty: blocks.observable(function(){
        return this.projects().length == 0;
    }),

    // aggiunge la permission quando si preme INVIO nella form corrispondente
    keydown: function(e){
        if(e.which == 13){
            this.addPermission(e.target.value);
        }
    },
    // Aggiunge permission all'applicazione Android se il processo di validazione va a buon fine
    addPermission: function(permissionName){

        if(permissionName){
            this.androidApplication.permission.name(permissionName);

            if(this.androidApplication.permission.name.validate())
            {
                this.androidApplication.permissions.add(this.androidApplication.permission);
                this.androidApplication.permission.reset();
            }

        }

    },
    // Controlla che i valori inseriti per gli Api Levels siano validi
    validateApiLevels: function(){
        var min = parseInt(this.androidApplication.minSdk());
        var max = parseInt(this.androidApplication.maxSdk());
        var target = parseInt(this.androidApplication.targetSdk());

        if(min > max){
            this.androidApplication.validationErrors.add("Min SDK Level must be greater than Max SDK level.");
        }
        if(target > max || target < min){
            this.androidApplication.validationErrors.add("Target SDK Level must be between Min and Max SDK Level");
        }
        if(min>max || target > max || target < min){
            return false;
        }else{
            return true;
        }
    },

    // Carica dal local storage il progetto selezionato
    loadFromJSON: function(){
        if(typeof(Storage) !== "undefined") {
            // projName = nome del progetto selezionato per essere caricato
            var projName = $('#projectName').find(":selected").attr('id');

            // controlla che l'applicazione che si sta modellando non e' la stessa che si vuole caricare
            if(projName == this.androidApplication.applicationName()){
                console.log("progetto attualmente in uso");
                return;
            }else{

                // resetta le proprieta' del modello AndroidApplication
                this.androidApplication.reset();

                // carica dal local storage del browser il progetto selezionato
                var obj = JSON.parse(localStorage.getItem("UMLAndroid-"+ projName));

                // Inizializzo il modello AndroidApplication
                this.androidApplication.applicationName(obj.appName);
                this.androidApplication.packageName(obj.packageName);
                this.androidApplication.minSdk(obj.minSdk);
                this.androidApplication.maxSdk(obj.maxSdk);
                this.androidApplication.targetSdk(obj.targetSdk);
                for(var i=0; i< obj.permissions.length; i++){
                    this.androidApplication.permission.name(obj.permissions[i]);
                    this.androidApplication.permissions.add(this.androidApplication.permission);
                }
                // this.createPaper();

                // crea il riquadro che conterra' il diagramma
                this.createApplicationDiagram();
                // carica e genera il diagramma prelevato dal local storage
                this.paper.graph.fromJSON(obj.diagram);
                // aggiorna l'array dei diagrammi
                this.recs.removeAll();
                this.recs.addMany(this.paper.graph.getCells());

                $('.tooltipped').tooltip({delay: 0});
            }

        } else {
          console.log("No Web Storage support.");
        }
    },
    // Apre la finestra di dialogo per la selezione del progetto che si vuole caricare in memoria
    openProjectModal: function(){
        if(typeof(Storage) !== "undefined") {


            // legge dal local storage la lista contenente i nomi dei progetti precedentemente memorizzati
            var projArray = JSON.parse(localStorage.getItem("UMLAndroid-Projects"));
            if(projArray["projects"].length >= 1){
                // reimposta la view relativa ai nomi dei progetti
                this.projects.removeAll();
            }

            // popola la view relativa ai nomi dei progetti
            for(var t = 0; t < projArray["projects"].length; t++){
                this.projects.add(projArray["projects"][t]);
            }
            $('select').material_select();

        } else {
            console.log("No Web Storage support.");
        }

    },
    // Salva nel local storage le informazioni dell'applicazione android
    saveToJSON: function(){
        if(typeof(Storage) !== "undefined") {
            if(this.androidApplication.applicationName() != ''){
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

                // cerca nell'elenco dei progetti se esiste gia un'applicazione con lo stesso nome
                // dell'applicazione corrente
                // se non è presente...
                if(projArray["projects"].indexOf(this.androidApplication.applicationName()) === -1){
                    // salva il nome dell'app tra i progetti
                    projArray["projects"].push(this.androidApplication.applicationName());
                    localStorage.setItem("UMLAndroid-Projects", JSON.stringify(projArray));
                    messaggio = "Progetto salvato.";

                }
                // se esiste già un'app con questo nome, sovrascrivo
                else if (projArray["projects"].indexOf(this.androidApplication.applicationName()) != -1){
                    messaggio = "Progetto sovrascritto.";
                }


                // creo un'entry nel localStorage per salvare l'app

                var key = "UMLAndroid-" + this.androidApplication.applicationName();

                var perms = [];
                for(var i = 0; i < this.androidApplication.permissions().length; i++){
                    perms.push(this.androidApplication.permissions()[i].name());
                }

                var value = {
                    appName: this.androidApplication.applicationName(),
                    diagram: this.paper.graph.toJSON(),
                    packageName: this.androidApplication.packageName(),
                    minSdk: this.androidApplication.minSdk(),
                    maxSdk: this.androidApplication.maxSdk(),
                    targetSdk: this.androidApplication.targetSdk(),
                    permissions: perms,

                };
                localStorage.setItem(key, JSON.stringify(value));

                console.log(messaggio);
                // $('#savedProject').openModal();

            }else{
                console.log("Application name empty.")
            }

        } else {
            console.log("No Web Storage support.");
        }
    },
    // Genera il file AndroidManifest.xml a partire dai diagrammi presenti nel paper
    generateManifest: function(){
        this.populateRecsName();

        if(!this.androidApplication.valid()){
            console.log(this.androidApplication.validationErrors());
            return;
        }
        if(!this.validateApiLevels()){
            console.log("Valori non validi per le Api");
            return;
        }

        var data = [
            '<?xml version="1.0" encoding="utf-8"?>\n',
            '<manifest\n\txmlns:android="http://schemas.android.com/apk/res/android"',
            '\n\tpackage="'+this.androidApplication.packageName()+'"',
            '\n\tandroid:versionCode="1"',
            '\n\tandroid:versionName="1"',
            '>\n',
        ].join('');

        // API LEVEL
        data+= [
            '\n\t\t<uses-sdk',
            '\n\t\t\tandroid:minSdkVersion="'+this.androidApplication.minSdk()+'"',
            '\n\t\t\tandroid:targetSdkVersion="'+ this.androidApplication.targetSdk()+'"',
            '\n\t\t\tandroid:maxSdkVersion="'+ this.androidApplication.maxSdk()+'" />\n',
        ].join('');

        // PERMISSIONS
        for(var i=0; i < this.androidApplication.permissions().length; i++){
            data+= '\n\t\t<uses-permission android:name="android.permission.'+this.androidApplication.permissions()[i].name()+'" />';
        }

        // APPLICATION
        data+=  [
            '\n\n\t\t<application',
            '\n\t\t\tandroid:name="'+this.androidApplication.applicationName()+'"',
            '\n\t\t>',
        ].join('');

        for(var i=0; i < this.recsName().length; i++){

            //ACTIVITY
            if(this.recsName()[i].attributes.prop.data.type == "activity"){
                var t = [
                    '\n\t\t\t<activity',
                    '\n\t\t\t\tandroid:name="'+this.recsName()[i].attributes.name+'"',
                    '>',
                ].join('');
                data+=t;

                var neighbors = this.paper.graph.getNeighbors(this.recsName()[i]);
                for(var j=0; j < neighbors.length; j++){
                    if(neighbors[j].attributes.prop.data.type =="intentFilter"){
                        var intentFilter = [
                            '\n\t\t\t\t\t<intent-filter>',
                            '\n\t\t\t\t\t\t<action',
                            '\n\t\t\t\t\t\t\tandroid:name="'+neighbors[j].attributes.name+'"',
                            '\n\t\t\t\t\t\t/>',

                            '\n\t\t\t\t\t</intent-filter>'
                        ].join('');
                        data+= intentFilter;
                    }
                }
                data += '\n\t\t\t</activity>';
            }

            //SERVICE
            if(this.recsName()[i].attributes.prop.data.type == "service"){
                var t = [
                    '\n\t\t\t<service',
                    '\n\t\t\t\tandroid:name="'+this.recsName()[i].attributes.name+'"',
                    '>',
                ].join('');
                data+=t;

                var neighbors = this.paper.graph.getNeighbors(this.recsName()[i]);
                for(var j=0; j < neighbors.length; j++){
                    if(neighbors[j].attributes.prop.data.type =="intentFilter"){
                        var intentFilter = [
                            '\n\t\t\t\t\t<intent-filter>',
                            '\n\t\t\t\t\t\t<action',
                            '\n\t\t\t\t\t\t\tandroid:name="'+neighbors[j].attributes.name+'"',
                            '\n\t\t\t\t\t\t/>',

                            '\n\t\t\t\t\t</intent-filter>'
                        ].join('');
                        data+= intentFilter;
                    }
                }
                data += '\n\t\t\t</service>';
            }

            //BROADCAST RECEIVER
            if(this.recsName()[i].attributes.prop.data.type == "broadcastReceiver"){
                var t = [
                    '\n\t\t\t<receiver',
                    '\n\t\t\t\tandroid:name="'+this.recsName()[i].attributes.name+'"',
                    '>',
                ].join('');
                data+=t;

                var neighbors = this.paper.graph.getNeighbors(this.recsName()[i]);
                for(var j=0; j < neighbors.length; j++){
                    if(neighbors[j].attributes.prop.data.type =="intentFilter"){
                        var intentFilter = [
                            '\n\t\t\t\t\t<intent-filter>',
                            '\n\t\t\t\t\t\t<action',
                            '\n\t\t\t\t\t\t\tandroid:name="'+neighbors[j].attributes.name+'"',
                            '\n\t\t\t\t\t\t/>',

                            '\n\t\t\t\t\t</intent-filter>'
                        ].join('');
                        data+= intentFilter;
                    }
                }
                data += '\n\t\t\t</receiver>';
            }

            //CONTENT PROVIDER
            if(this.recsName()[i].attributes.prop.data.type == "contentProvider"){
                var t = [
                    '\n\t\t\t<provider',
                    '\n\t\t\t\tandroid:name="'+this.recsName()[i].attributes.name+'"',
                    '>',
                    '\n\t\t\t</provider>'
                ].join('');
                data+=t;
            }
        }

        data += '\n\t\t</application>'+'\n</manifest>';

        //console.log(data);

        this.downloadManifest("AndroidManifest.xml", data);

    },
    // Funzione per il download del file manifest
    downloadManifest: function(filename, data) {
        var blob = new Blob([data], {type: 'octet/stream'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem)
            elem.click();
            document.body.removeChild(elem);
        }
    },

    // inizializza il paper che conterra' i diagrammi
    createPaper: function(){
        this.paper = ((this.paper instanceof MyPaper) ? this.paper : new MyPaper(document.getElementById('applicationDiagram'), window.innerWidth * 0.97));
    },

    // valida le informazioni generali  dell'applicazione Android, crea il paper e aggiunge il primo diagram
    createApplicationDiagram: function(){
        if(this.androidApplication.valid() && this.validateApiLevels()){
            this.startingDiagram(true);
            this.toggleEditApplicationSection();

            // this.paper = new MyPaper($('#applicationDiagram'), window.innerWidth * 0.97);
            this.createPaper();

            if(this.paper instanceof MyPaper){

                if(this.paper.graph.getCells().length == 0){
                    var r = AndroidApp(0,0, this.androidApplication.applicationName(), 'noicon',  AndroidComponents["noicon"].icon);

                    this.recs.add(r);
                    $(window).on('resize', function(){
                        App.ModelingApplication.paper.paper.setDimensions( window.innerWidth * 0.97, 500);
                    });
                    this.updateDiagram();

                }
            }
            location.href = "#applicationDiagram";
        }else{
            console.log(this.androidApplication.validationErrors());
        }

    },


    // Aggiorna la lista dei nomi dei diagrammi
    populateRecsName: function(){
        this.recsName.removeAll();
        for(var i = 0; i < this.recs().length; i++){
            //se l'elemento non è un link, viene aggiunto alla lista dei nomi dei diagrammi
            if(!this.recs()[i].attributes.hasOwnProperty("target")){
                this.recsName.push(this.recs()[i]);
            }
        }

    },

    // Scala il diagramma per riempire l'area di disegno
    fitDiagram: function(){
      this.paper.paper.scaleContentToFit();
    },
    // Incrementa il livello di zoom e scala i diagrammi
    zoomIn: function(){
        this.zoomLevel( this.zoomLevel() + 0.2);
        this.paper.paper.scale(this.zoomLevel());
    },
    // Diminuisce il livello di zoom e scala i diagrammi
    zoomOut: function(){
        this.zoomLevel( this.zoomLevel() - 0.2);
        this.paper.paper.scale(this.zoomLevel());
    },
    // Dispone i diagrammi in modo gerarchico
    layoutDiagram: function(){
        joint.layout.DirectedGraph.layout(
            this.paper.graph,
            {
                setLinkVertices: false,
                rankDir: "BT"
            }
        );
    },
    // Visualizza un menu contestuale grazie al plugin contextmenu
    // Le relazioni possono essere inserite solo quando ci sono due o piu' diagrammi
    showMenu: function(){
        var fn = this.openModalFromContextMenu;
        var opt = {}

        if(this.paper.graph.attributes.cells.length < 2){

            opt = {
                'Add Android Component': fn,
                // 'Add Custom Class': fn,
            }
        }else{
            opt = {
                'Add Android Component': fn,
                // 'Add Custom Class': fn,
                'Add Relation' : fn
            }
        }

        $('#applicationDiagram').contextmenu(opt, 'right');
    },
    // Visualizza la finestra di dialogo corrispondente alla selezione del menu contestuale
    openModalFromContextMenu: function(evt,parent){

        switch(evt.target.textContent){

            case "Add Relation":
                this.openModalWindow('#NewCustomLinkModal');
                break;

            // case "Add Custom Class":
            //     this.openModalWindow('#NewCustomClassModal');
            //     break;


            case "Add Android Component":
                this.openModalWindow('#NewAndroidComponentModal');
                break;
        }
    },
    // Funzione di utilita' per la visualizzazione di finestre di dialogo
    openModalWindow: function(data){
        this.populateRecsName();
        $('select').material_select();

        if( (typeof data) === 'string'){
            $(data).openModal();
        }else if(data.type === 'click'){
            $(data.target.hash).openModal();
        }

    },


    // Aggiunge un diagramma di tipo Android al paper
    // Le informazioni necessarie vengono prelevate dalla form presentata all'utente
    addAndroidComponentTo: function(){
        // Preleva le informazioni
        var componentName = $('#ComponentName').val();
        var componentType = $('#ComponentType').find(":selected").attr('id');
        var relationType = $('#ComponentRelationType').find(":selected").attr('id');
        var parentId = $('#ComponentParentName').find(":selected").attr('id');

        // crea il diagramma
        var rect = AndroidRect(0,0, componentName, componentType, AndroidManifestComponents[componentType].icon);
        // aggiunge il diagramma alla view
        this.recs.add(rect);

        // aggiorna i diagrammi della view
        this.updateDiagram();

        // crea la relazione tra il diagramma creato e il suo genitore
        var link = createUmlLink(rect.id, parentId, relationType );
        // aggiunge la relazione al paper
        this.paper.graph.addCell(link);
        $('select').material_select();
    },

    // addCustomClassTo: function(){
    //     var rectName = $('#CustomClassName').val();
    //     var rectType = $('#CustomClassType').find(":selected").attr('id');
    //     var relationType = $('#CustomClassRelationType').find(":selected").attr('id');
    //     var parentId = $('#CustomClassParentName').find(":selected").attr('id');
    //
    //     var rectDefinition = {
    //         position: { x:300  , y: 300 },
    //         size: { width: 260, height: 100 },
    //         name: rectName,
    //         attrs: {
    //             '.uml-class-name-rect': {
    //                 fill: colors.customClass.titleBackground,
    //                 stroke: colors.customClass.titleBorder,
    //                 'stroke-width': 2
    //             },
    //             '.uml-class-attrs-rect, .uml-class-methods-rect': {
    //                 fill: colors.customClass.propBackground,
    //                 stroke: colors.customClass.propBorder,
    //                 'stroke-width': 2
    //             },
    //             '.uml-class-methods-text, .uml-class-attrs-text': {
    //                 fill: colors.customClass.propBackground,
    //             }
    //         }
    //     }
    //
    //     switch(rectType){
    //         case "abstract":
    //             var rect = new joint.shapes.uml.Abstract(rectDefinition);
    //             break;
    //         case "custom":
    //             var rect = new joint.shapes.uml.CustomClass(rectDefinition);
    //             break;
    //         case "interface":
    //             var rect = new joint.shapes.uml.Interface(rectDefinition);
    //             break;
    //     }
    //
    //     this.recs.add(rect);
    //     this.updateDiagram();
    //
    //     var link = createUmlLink(rect.id, parentId, relationType );
    //     this.paper.graph.addCell(link);
    //
    //     $('select').material_select();
    // },

    // Aggiunge una relazione tra due diagrammi
    // Le informazioni necessarie vengono prelevate dalla form presentata all'utente
    addCustomLink: function(){
        var parentId = $('#LinkComponentParentName').find(":selected").attr('id');
        var childId = $('#LinkComponentChildName').find(":selected").attr('id');
        var relationType = $('#LinkComponentRelationType').find(":selected").attr('id');

        var link = createUmlLink(childId, parentId, relationType );
        this.paper.graph.addCell(link);

        $('select').material_select();

    },

    // Aggiorna il paper con i diagrammi presenti nell'array recs e li ridispone
    updateDiagram: function(){
        this.paper.graph.addCells(this.recs());

        this.layoutDiagram();
        if(this.recs().length > 10){
            this.fitDiagram();
        }

    },

});
