const firebaseConfig = {
    apiKey: "AIzaSyBgkjo1nhIDb95HH1P4FbhS6hl7pUik0ac",
    authDomain: "kgsql-a0c98.firebaseapp.com",
    databaseURL: "https://kgsql-a0c98.firebaseio.com",
    projectId: "kgsql-a0c98",
    storageBucket: "kgsql-a0c98.appspot.com",
    messagingSenderId: "919616296031",
    appId: "1:919616296031:web:b058ae7a9847f95df077ea"
};
// Initialize Firebase

$(function(){
    function jump(cid = ""){
        let url = window.location.href.split('?')[0];
        if (cid != "") url += "?id=" + cid;
        location.href = url;
    }

    firebase.initializeApp(firebaseConfig);
    const fdb = firebase.firestore();

    const editor = ace.edit("editor", {
        theme: "ace/theme/chrome",
        mode: "ace/mode/sql",
        minLines: 15,
        maxLines: 30
    });
    editor.resize();
    editor.session.setMode("ace/mode/sql");
    editor.focus();

    const kgtbl1 = new KGTable("kgtbl1");
    const kgtbl2 = new KGTable("kgtbl2", true);
    const kgtbl3 = new KGTable("kgtbl3");

    let db;

    function submit() {
        kgtbl2.clearTable();
        const sql = kgtbl1.makeQuery() + editor.getValue();
        $("#logta").val("-- 実行sql\n" + sql);
        document.getElementById('error').innerHTML = '';
        let result = '', error = '';
        try { result = db.exec(sql); }
        catch (e) { error = e; }
        for (let i = 0; i < result.length; i++) {
            const tableNo = i + 1;
            const cols = result[i].columns.length;
            const rows = result[i].values.length;
            kgtbl2.addTable(cols, rows);
            kgtbl2.setTableName(tableNo, "");
            for (let j = 0; j < cols; j++) {
                kgtbl2.setTableHead(tableNo, j + 1, result[i].columns[j], null);
            }
            kgtbl2.setTable(tableNo, result[i].values);
        }
        if (error != '') {
            document.getElementById('error').innerHTML = error;
            $("#nav4").click();
        } else {
            if (kgtbl2.check(kgtbl3.getJSON())) {
                $("#testbadge").text("test passed");
                $("#testbadge").attr('class', "badge badge-success");
            } else {
                $("#testbadge").text("test result");
                $("#testbadge").attr('class', "badge badge-secondary");                
            }
            $("#nav2").click();
        }
    };
    $('#submit').on('click', function(){
        submit();
    });

    $("#upload").on('click', function(){
        fdb.collection("documents").add({
            code: encodeURI(editor.getValue()),
            input: encodeURI(kgtbl1.getJSON(true)),
            test: encodeURI(kgtbl3.getJSON())
        })
        .then(function(docRef){
            // location.href = "index.html?id=" + docRef.id;
            let url = window.location.href.split('?')[0] + "?id=" + docRef.id;
            $("#newUrl").text(url);
            $("#newUrl").attr('href', url);
            // jump(docRef.id);
        })
        .catch(function(error){
            console.log(error);
        });

    });

    $("#o2t").on('click', function(){
        kgtbl3.setFromJSON(kgtbl2.getJSON());
        $("#nav3").click();
    });


    const codeId = getQuerry("id");
    if (codeId != "none") {
        fdb.collection('documents')
        .doc(codeId)
        .get()
        .then(function(doc){
            if (doc.exists) {
                editor.setValue(decodeURI(doc.data().code), -1);
                kgtbl1.setFromJSON(decodeURI(doc.data().input));
                kgtbl3.setFromJSON(decodeURI(doc.data().test));
                initSqlJs({ locateFile: filename => `../dist/${filename}` }).then(function (SQL) {
                    db = new SQL.Database();
                    db.exec('select 1;');
                });
                $('#gototop').text('KGSQL ブラウザで実行するSQLエディタ');
            } else {
                jump();
            }
        })
        .catch(function(error){
            jump();
        });
    } else{
        initSqlJs({ locateFile: filename => `../dist/${filename}` }).then(function (SQL) {
            db = new SQL.Database();
            db.exec('select 1;');
        });
        $('#gototop').text('KGSQL ブラウザで実行するSQLエディタ');
    }
    $("#gototop").on('click', function(){
        jump();
    });
    $('#editor').keydown(function(e){
        const ev = e || window.event;
        if(window.event.ctrlKey){
            if(ev.keyCode === 13){
                $('#submit').click();
                return false;
            }
            if(ev.keyCode === 83){
                $('#upload').click();
                return false;
            }
        }
    });
});
function getQuerry(key = "id", none = "none"){
    const url = window.location.search;
    const hash  = url.slice(1).split('&');    
    for (let i = 0; i < hash.length; i++) {
        const sp = hash[i].split('='); 
        if (sp[0] == key)return sp[1];
    }
    return none;
}