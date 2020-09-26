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

    // kgtbl1.addTable(2, 3);
    // kgtbl1.setTableName(1, "pv_table");
    // kgtbl1.setTableHead(1, 1, "userid", "VARCHAR(20)");
    // kgtbl1.setTableHeadName(1, 2, "pv");
    // kgtbl1.setTable(1, [["user1", 10], ["user3", 30], ["user5", 50]]);

    // kgtbl1.addTable(2, 5);
    // kgtbl1.setTableName(2, "user_table");
    // kgtbl1.setTableHead(2, 1, "userid", "VARCHAR(20)");
    // kgtbl1.setTableHeadName(2, 2, "age");
    // kgtbl1.setTable(2, [["user1", 20], ["user2", 25], ["user3", 30], ["user4", 35], ["user5", 40]]);
    

    let db;
    initSqlJs({ locateFile: filename => `../dist/${filename}` }).then(function (SQL) {
        db = new SQL.Database();
    });

    document.getElementById('submit').onclick = function () {
        // console.log("1");
        kgtbl2.clearTable();
        // console.log("2");
        const sql = kgtbl1.makeQuery() + editor.getValue();
        $("#logta").val("-- 実行sql\n" + sql);
        // console.log(sql);
        document.getElementById('error').innerHTML = '';
        let result = '', error = '';
        try { result = db.exec(sql); }
        catch (e) { error = e; }
        // kgtbl3.setFromJSON(JSON.stringify(result));
        // console.log(kgtbl1.getJSON(true));
        // console.log(kgtbl3.getJSON());
        // console.log(JSON.parse(kgtbl1.getJSON()));
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
        // document.getElementById('result').innerHTML = JSON.stringify(result, null, '  ');
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
            // console.log(kgtbl1.getJSON());
        }
    };

    $("#upload").on('click', function(){
        fdb.collection("documents").add({
            code: encodeURI(editor.getValue()),
            input: encodeURI(kgtbl1.getJSON(true)),
            test: encodeURI(kgtbl3.getJSON())
        })
        .then(function(docRef){
            // location.href = "index.html?id=" + docRef.id;
            jump(docRef.id);
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
            } else {
                jump();
            }
        })
        .catch(function(error){
            jump();
        });
    }
    $("#gototop").on('click', function(){
        jump();
    });
    $('#editor').keydown(function(e){
        const ev = e || window.event;
        if(event.ctrlKey){
            if(ev.keyCode === 13){
                $('#submit').click();
                return false;
            }
        }
    });
    $('#editor').keydown(function(e){
        const ev = e || window.event;
        if(event.ctrlKey){
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