var colors = {
    customClass: {
        titleBackground: "#DAEEFD",
        titleBorder: "#DAEEFD",
        propBackground: "#FFFFFF",
        propBorder: "#DAEEFD",
    },
    androidComponent: {
        titleBackground: "#8BC34A",
        titleBorder: "#8BC34A",
        propBackground: "#FFFFFF",
        propBorder: "#8BC34A",
        textColor: "#FFFFFF"
    }

}

var widgets = [
// Direct Subclasses of View
"AnalogClock",
"ImageView",
"KeyboardView",
"MediaRouteButton",
"ProgressBar",
"Space",
"SurfaceView",
"TextView",
"TextureView",
"ViewStub",
];
// Indirect Subclasses of View
// "AbsListView",
// "AbsSeekBar",
// "AbsSpinner",
// "ActionMenuView",
// "AppCompatAutoCompleteTextView",
// "AppCompatButton",
// "AppCompatCheckBox",
// "AppCompatCheckedTextView",
// "AppCompatEditText",
// "AppCompatImageButton",
// "AppCompatImageView",
// "AppCompatMultiAutoCompleteTextView",
// "AppCompatRadioButton",
// "AppCompatRatingBar",
// "AppCompatSeekBar",
// "AppCompatSpinner",
// "AppCompatTextView",
// "AppWidgetHostView",
// "AutoCompleteTextView",
// "Button",
// "CalendarView",
// "CheckBox",
// "CheckedTextView",
// "Chronometer",
// "CompoundButton",
// "ContentLoadingProgressBar",
// "DatePicker",
// "DialerFilter",
// "DigitalClock",
// "EditText",
// "ExpandableListView",
// "ExtractEditText",
// "FloatingActionButton",
// "FragmentBreadCrumbs",
// "FragmentTabHost",
// "GLSurfaceView",
// "GestureOverlayView",
// "GuidedActionEditText",
// "ImageButton",
// "ImageCardView",
// "ImageSwitcher",
// "ListRowHoverCardView",
// "ListView",
// "MediaController",
// "MultiAutoCompleteTextView",
// "NavigationView",
// "NumberPicker",
// "PagerTabStrip",
// "PagerTitleStrip",
// "QuickContactBadge",
// "RadioButton",
// "RadioGroup",
// "RatingBar",
// "RecyclerView",
// "RowHeaderView",
// "SearchBar",
// "SearchEditText",
// "SearchOrbView",
// "SearchView",
// "SeekBar",
// "SlidingDrawer",
// "SlidingPaneLayout",
// "Space",
// "SpeechOrbView",
// "Spinner",
// "StackView",
// "Switch",
// "SwitchCompat",
// "TabWidget",
// "TextClock",
// "TextSwitcher",
// "TimePicker",
// "TitleView",
// "ToggleButton",
// "Toolbar",
// "TvView",
// "VideoView",
// "WebView",
// "ZoomButton",
// "ZoomControls",

var layouts = [
// Direct Subclasses of ViewGroup
"AbsoluteLayout",
"AdapterView",
"CoordinatorLayout",
"DrawerLayout",
"FragmentBreadCrumbs",
"FrameLayout",
"GridLayout",
"LinearLayout",
"LinearLayoutCompat",
"PagerTitleStrip",
"RecyclerView",
"RelativeLayout",
"SlidingDrawer",
"SlidingPaneLayout",
"SwipeRefreshLayout",
"Toolbar",
"TvView",
"ViewGroup",
"ViewPager",
];
// Indirect Subclasses of ViewGroup
// "AbsListView",
// "AbsSpinner",
// "ActionMenuView",
// "AdapterViewAnimator",
// "AdapterViewFlipper",
// "AppBarLayout",
// "AppCompatSpinner",
// "AppWidgetHostView",
// "BaseCardView",
// "BrowseFrameLayout",
// "CalendarView",
// "CardView",
// "CollapsingToolbarLayout",
// "DatePicker",
// "DialerFilter",
// "ExpandableListView",
// "FragmentTabHost",
// "Gallery",
// "GestureOverlayView",
// "GridView",
// "HorizontalGridView",
// "HorizontalScrollView",
// "ImageCardView",
// "ImageSwitcher",
// "ListRowHoverCardView",
// "ListRowView",
// "ListView",
// "MediaController",
// "NavigationView",
// "NestedScrollView",
// "NumberPicker",
// "PagerTabStrip",
// "PercentFrameLayout",
// "PercentRelativeLayout",
// "RadioGroup",
// "ScrollView",
// "SearchBar",
// "SearchOrbView",
// "SearchView",
// "ShadowOverlayContainer",
// "SpeechOrbView",
// "Spinner",
// "StackView",
// "TabHost",
// "TabLayout",
// "TabWidget",
// "TableLayout",
// "TableRow",
// "TextInputLayout",
// "TextSwitcher",
// "TimePicker",
// "TitleView",
// "TwoLineListItem",
// "VerticalGridView",
// "ViewAnimator",
// "ViewFlipper",
// "ViewSwitcher",
// "WebView",
// "ZoomControls",

var ClassTypes = {
    abstract: {
        id: "abstract",
        name: "Abstract",
        icon: ""
    },
    class: {
        id: "custom",
        name: "Class",
        icon: ""
    },
    interface: {
        id: "interface",
        name: "Interface",
        icon: ""
    },
}

var AndroidManifestComponents = {
    activity: {
        id: "activity",
        name: "Activity",
        icon: 'img/activity.png',
    },
    broadcastReceiver: {
        id: 'broadcastReceiver',
        name: "Broadcast Receiver",
        icon: 'img/broadcast-receiver.png',
    },
    contentProvider: {
        id: 'contentProvider',
        name: "Content Provider",
        icon: 'img/content-provider.png',
    },
    intentFilter:{
        id: 'intentFilter',
        name: "Intent filter",
        icon: 'img/intent.png',
    },
    service: {
        id: 'service',
        name: "Service",
        icon: 'img/cog.png',
    },
}
var AndroidComponents = {
    activity: {
        id: "activity",
        name: "Activity",
        icon: 'img/activity.png',
    },
    broadcastReceiver: {
        id: 'broadcastReceiver',
        name: "Broadcast Receiver",
        icon: 'img/broadcast-receiver.png',
    },
    contentProvider: {
        id: 'contentProvider',
        name: "Content Provider",
        icon: 'img/content-provider.png',
    },
    explicitIntent:{
        id: 'explicitIntent',
        name: "Explicit Intent",
        icon: 'img/intent.png',
    },
    implicitIntent:{
        id: 'implicitIntent',
        name: "Implicit Intent",
        icon: 'img/implicit-intent.png',
    },
    layout: {
        id: 'layout',
        name: "Layout",
        icon: 'img/layout.png',
    },
    service: {
        id: 'service',
        name: "Service",
        icon: 'img/cog.png',
    },
    widget: {
        id: 'widget',
        name: "Widget",
        icon: 'img/widget.png'
    },
    noicon:{
      id: 'noicon',
      name: "No Icon",
      icon: ''
    }

}

var UmlLinks = {
    aggregation: {
        id: 'aggregation',
        name: "Aggregation",
        icon: "img/aggregation.png",
    },
    association: {
        id: 'association',
        name: "Association",
        icon: "img/association.png",
    },
    composition: {
        id: 'composition',
        name: "Composition",
        icon: "img/composition.png",
    },
    generalization: {
        id: 'generalization',
        name: "Generalization",
        icon: "img/generalization.png",
    },
    implementation: {
        id: 'implementation',
        name: "Implementation",
        icon: "img/implementation.png",
    },

}

var xmlLayoutFile = {
  licenza :    "<!-- Licenza -->\n",
  intestazione: '<?xml version="1.0" encoding="utf-8"?>\n',
  content: "",

}

var permissionsSet = [
    "ACCESS_CHECKIN_PROPERTIES",
	"ACCESS_COARSE_LOCATION",
	"ACCESS_FINE_LOCATION",
	"ACCESS_LOCATION_EXTRA_COMMANDS",
	"ACCESS_NETWORK_STATE",
	"ACCESS_NOTIFICATION_POLICY",
	"ACCESS_WIFI_STATE",
	"ACCOUNT_MANAGER",
	"ADD_VOICEMAIL",
	"BATTERY_STATS",
	"BIND_ACCESSIBILITY_SERVICE",
	"BIND_APPWIDGET",
	"BIND_CARRIER_MESSAGING_SERVICE",
	"BIND_CARRIER_SERVICES",
	"BIND_CHOOSER_TARGET_SERVICE",
	"BIND_DEVICE_ADMIN",
	"BIND_DREAM_SERVICE",,
	"BIND_INCALL_SERVICE",
	"BIND_INPUT_METHOD",
	"BIND_MIDI_DEVICE_SERVICE",
	"BIND_NFC_SERVICE",
	"BIND_NOTIFICATION_LISTENER_SERVICE",
	"BIND_PRINT_SERVICE",
	"BIND_REMOTEVIEWS",
	"BIND_TELECOM_CONNECTION_SERVICE",
	"BIND_TEXT_SERVICE",
	"BIND_TV_INPUT",
	"BIND_VOICE_INTERACTION",
	"BIND_VPN_SERVICE",
	"BIND_WALLPAPER",
	"BLUETOOTH",
	"BLUETOOTH_ADMIN",
	"BLUETOOTH_PRIVILEGED",
	"BODY_SENSORS",
	"BROADCAST_PACKAGE_REMOVED",
	"BROADCAST_SMS",
	"BROADCAST_STICKY",
	"BROADCAST_WAP_PUSH",
	"CALL_PHONE",
	"CALL_PRIVILEGED",
	"CAMERA",
	"CAPTURE_AUDIO_OUTPUT",
	"CAPTURE_SECURE_VIDEO_OUTPUT",
	"CAPTURE_VIDEO_OUTPUT",
	"CHANGE_COMPONENT_ENABLED_STATE",
	"CHANGE_CONFIGURATION",
	"CHANGE_NETWORK_STATE",
	"CHANGE_WIFI_MULTICAST_STATE",
	"CHANGE_WIFI_STATE",
	"CLEAR_APP_CACHE",
	"CONTROL_LOCATION_UPDATES",
	"DELETE_CACHE_FILES",
	"DELETE_PACKAGES",
	"DIAGNOSTIC",
	"DISABLE_KEYGUARD",
	"DUMP",
	"EXPAND_STATUS_BAR",
	"FACTORY_TEST",
	"FLASHLIGHT",
	"GET_ACCOUNTS",
	"GET_ACCOUNTS_PRIVILEGED",
	"GET_PACKAGE_SIZE",
	"GET_TASKS",
	"GLOBAL_SEARCH",
	"INSTALL_LOCATION_PROVIDER",
	"INSTALL_PACKAGES",
	"INSTALL_SHORTCUT",
	"INTERNET",
	"KILL_BACKGROUND_PROCESSES",
	"LOCATION_HARDWARE",
	"MASTER_CLEAR",
	"MEDIA_CONTENT_CONTROL",
	"MODIFY_AUDIO_SETTINGS",
	"MODIFY_PHONE_STATE",
	"MOUNT_FORMAT_FILESYSTEMS",
	"MOUNT_UNMOUNT_FILESYSTEMS",
	"NFC",
	"PACKAGE_USAGE_STATS",
	"PERSISTENT_ACTIVITY",
	"PROCESS_OUTGOING_CALLS",
	"READ_CALENDAR",
	"READ_CALL_LOG",
	"READ_CONTACTS",
	"READ_EXTERNAL_STORAGE",
	"READ_FRAME_BUFFER",
	"READ_INPUT_STATE",
	"READ_LOGS",
	"READ_PHONE_STATE",
	"READ_SMS",
	"READ_SYNC_SETTINGS",
	"READ_SYNC_STATS",
	"READ_VOICEMAIL",
	"REBOOT",
	"RECEIVE_BOOT_COMPLETED",
	"RECEIVE_MMS",
	"RECEIVE_SMS",
	"RECEIVE_WAP_PUSH",
	"RECORD_AUDIO",
	"REORDER_TASKS",
	"REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
	"REQUEST_INSTALL_PACKAGES",
	"RESTART_PACKAGES",
	"SEND_RESPOND_VIA_MESSAGE",
	"SEND_SMS",
	"SET_ALARM",
	"SET_ALWAYS_FINISH",
	"SET_ANIMATION_SCALE",
	"SET_DEBUG_APP",
	"SET_PREFERRED_APPLICATIONS",
	"SET_PROCESS_LIMIT",
	"SET_TIME",
	"SET_TIME_ZONE",
	"SET_WALLPAPER",
	"SET_WALLPAPER_HINTS",
	"SIGNAL_PERSISTENT_PROCESSES",
	"STATUS_BAR",
	"SYSTEM_ALERT_WINDOW",
	"TRANSMIT_IR",
	"UNINSTALL_SHORTCUT",
	"UPDATE_DEVICE_STATS",
	"USE_FINGERPRINT",
	"USE_SIP",
	"VIBRATE",
	"WAKE_LOCK",
	"WRITE_APN_SETTINGS",
	"WRITE_CALENDAR",
	"WRITE_CALL_LOG",
	"WRITE_CONTACTS",
	"WRITE_EXTERNAL_STORAGE",
	"WRITE_GSERVICES",
	"WRITE_SECURE_SETTINGS",
	"WRITE_SETTINGS",
	"WRITE_SYNC_SETTINGS",
	"WRITE_VOICEMAIL",
];

function generateActivityClassFile(packageName, className){
  var content =  'package '+ packageName + ';\n\n';

  content += 'public class '+className +' extends Activity {\n\n';

  content += '\t@Override\n';
  content += '\tprotected void onCreate(Bundle savedInstanceState){\n';
  content += '\t\tsuper.onCreate(savedInstanceState);\n';
  content += '\t\t// The activity is being created.\n';
  content += '\t}\n\n';

  content += '\t@Override\n';
  content += '\tprotected void onStart(){\n';
  content += '\t\tsuper.onStart();\n';
  content += '\t\t// The activity is about to become visible.\n';
  content += '\t}\n\n';

  content += '\t@Override\n';
  content += '\tprotected void onResume(){\n';
  content += '\t\tsuper.onResume();\n';
  content += '\t\t// The activity has become visible (it is now "resumed").\n';
  content += '\t}\n\n';

  content += '\t@Override\n';
  content += '\tprotected void onPause(){\n';
  content += '\t\tsuper.onPause();\n';
  content += '\t\t// Another activity is taking focus (this activity is about to be "paused").\n';
  content += '\t}\n\n';



  content += '\t@Override\n';
  content += '\tprotected void onStop(){\n';
  content += '\t\tsuper.onStop);\n';
  content += '\t\t// The activity is no longer visible (it is now "stopped") \n';
  content += '\t}\n\n';

  content += '\t@Override\n';
  content += '\tprotected void onDestroy(){\n';
  content += '\t\tsuper.onDestroy();\n';
  content += '\t\t// The activity is about to be destroyed.\n';
  content += '\t}\n\n';

  content += '}';

  return content;

}

function generateReceiverClassFile(packageName, className){
  var content =  'package '+ packageName + ';\n\n';

  content += 'public class '+className +' extends BroadcastReceiver {\n\n';

  content += '\t@Override\n';
  content += '\tprotected void onReceive(Context context, Intent intent){\n';
  content += '\t\tToast.makeText(context, "Intent Detected.", Toast.LENGTH_LONG).show();\n';
  content += '\t}\n\n';

  content += '}';

  return content;

}

function generateServiceClassFile(packageName, className){
  var content =  'package '+ packageName + ';\n\n';

  content += 'public class '+className +' extends Service {\n\n';
  content += '\tint mStartMode;\t// indicates how to behave if the service is killed\n';
  content += '\tIBinder mBinder;\t// interface for clients that bind\n';
  content += '\tboolean mAllowRebind;\t// indicates whether onRebind should be used\n\n';

  content += '\t@Override\n';
  content += '\tpublic void onCreate() {\n';
  content += '\t\t// The service is being created\n';
  content += '\t}\n\n';

  content += '\t@Override\n';
  content += '\tpublic int onStartCommand(Intent intent, int flags, int startId) {\n';
  content += '\t\t// The service is starting, due to a call to startService()\n';
  content += '\t\treturn mStartMode;\n';
  content += '\t}\n\n';

  content += '\t@Override\n';
  content += '\tpublic IBinder onBind(Intent intent) {\n';
  content += '\t\t// A client is binding to the service with bindService()\n';
  content += '\t\treturn mBinder;\n';
  content += '\t}\n';

  content += '\t@Override\n';
  content += '\tpublic boolean onUnbind(Intent intent) {\n';
  content += '\t\t// All clients have unbound with unbindService()\n';
  content += '\t\treturn mAllowRebind;\n';
  content += '\t}\n';

  content += '\t@Override\n';
  content += '\tpublic void onRebind(Intent intent) {\n';
  content += '\t\t// A client is binding to the service with bindService(),\n';
  content += '\t\t// after onUnbind() has already been called\n';
  content += '\t}\n';

  content += '\t@Override\n';
  content += '\tpublic void onDestroy() {\n';
  content += '\t\t// The service is no longer used and is being destroyed\n';
  content += '\t}\n';

  content += '}';
  return content;
}

function generateContentProviderClassFile(packageName, className){
    var content = 'package '+ packageName + ';\n\n';
    content += 'public class '+className +' extends ContentProvider {\n\n';
    content += '\tstatic final UriMatcher uriMatcher;\n\n';

    content += '\t@Override\n';
    content += '\tpublic boolean onCreate(){\n';
    content += '\t\tContext context = getContext();\n\n';
    content += '\t}\n\n';

    content += '\t@Override\n';
    content += '\tpublic Uri insert(Uri uri, ContentValues values){\n\n';
    content += '\t}\n\n';

    content += '\t@Override\n';
    content += '\tpublic Cursor query(Uri uri, String[] projection, String selection,String[] selectionArgs, String sortOrder) {\n\n';
    content += '\t}\n\n';

    content += '\t@Override\n';
    content += '\tpublic int delete(Uri uri, String selection, String[] selectionArgs) {\n\n';
    content += '\t}\n\n';

    content += '\t@Override\n';
    content += '\tpublic int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {\n\n';
    content += '\t}\n\n';

    content += '\t@Override\n';
    content += '\tpublic String getType(Uri uri) {\n\n';
    content += '\t}\n\n';

    return content;
}

function generateXmlLayoutFile(id){
  var content = '<?xml version="1.0" encoding="utf-8"?>\n';

  content += '\t<RelativeLayout android:id="@+id/'+id+'">\n';
  content += '\t</RelativeLayout>\n';

  return content;
}
