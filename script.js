// vim: sw=4 ts=4 et
document.addEventListener( "DOMContentLoaded", function() {
    var SWITCH_COLOR = "green";
    var DELETE_COLOR = "red";

    function addShortcut( buttonEl ) {
        var table = buttonEl.parentNode.children[0].children[0];
        if( table.tagName.toLowerCase() !== "tbody" ) {
            console.error( "Error while finding a nearby table!" );
            return;
        }

        var newRow = document.createElement( "tr" );
        newRow.innerHTML = "<td><input type='text' class='key' maxlength='1' /></td><td><input type='text' class='value' /> [<a href='#'>switch</a><span class='sep'>|</span><a href='#'>delete</a>]</td>"
        table.appendChild( newRow );
        var newRow = table.children[ table.children.length - 1 ];
        var newLinks = newRow.querySelectorAll( "a" );
        addLinkEventListeners( newLinks );
    }

    function addLinkEventListeners( newLinks ) {

        // "switch", click
        newLinks[0].addEventListener( "click", function () {
            var oldEl = this.previousElementSibling;
            switch( oldEl.tagName.toLowerCase() ) {
                case "div":
                    var newField = document.createElement( "input" );
                    newField.setAttribute( "type", "text" );
                    newField.className = "value";
                    oldEl.parentNode.replaceChild( newField, oldEl );
                    break;
                case "input":
                    var newDiv = document.createElement( "div" );
                    newDiv.innerHTML = "<table><tbody></tbody></table><button class='add-shortcut'>Add shortcut</button>";
                    oldEl.parentNode.replaceChild( newDiv, oldEl );
                    var btn = this.previousElementSibling.children[1];
                    if( btn.tagName.toLowerCase() !== "button" ) {
                        console.error( btn, " was not a button!" );
                        return;
                    }
                    btn.addEventListener( "click", function () { addShortcut( btn ); } );
                    addShortcut( btn );
                    break;
                default:
                    console.error( "Wrong tag name! ", oldEl );
                    break;
            }
        } );

        // "switch", hover
        newLinks[0].addEventListener( "mouseover", function () {
            this.previousElementSibling.style.backgroundColor = SWITCH_COLOR;
        } );
        newLinks[0].addEventListener( "mouseout", function () {
            this.previousElementSibling.style.backgroundColor = "";
        } );

        // "delete"
        newLinks[1].addEventListener( "click", function () {
            var row = this.parentNode.parentNode;
            row.parentNode.removeChild( row );
        } );

        // "delete", hover
        newLinks[1].addEventListener( "mouseover", function () {
            this.parentNode.parentNode.style.backgroundColor = DELETE_COLOR;
        } );
        newLinks[1].addEventListener( "mouseout", function () {
            this.parentNode.parentNode.style.backgroundColor = "";
        } );
    }

    function tableToJson( table ) {
        var tbody = table.children[0];
        var result = "";
        for( var i = 0; i < tbody.children.length; i++ ) {
            var row = tbody.children[i];
            result += '"' + row.children[0].children[0].value + '":';
            var dataEl = row.children[1].children[0];
            switch( dataEl.tagName.toLowerCase() ) {
                case "input":
                    result += '"' + dataEl.value + '"';
                    break;
                case "div":
                    result += tableToJson( dataEl.children[0] );
                    break;
                default:
                    console.error( "wtf" );
                    break;
            }
            if( i < tbody.children.length - 1 ) result += ",";
        }
        return "{" + result + "}";
    }

    document.getElementById( "export-btn" ).addEventListener( "click", function () {
        document.getElementById( "json" ).value = tableToJson( document.getElementById( "tree" ).children[0] );
        document.getElementById( "json" ).select();
        document.execCommand( "copy" );
    } );

    var button = document.querySelector( "#tree button" );
    button.addEventListener( "click", function () { addShortcut( this ); } );
    addShortcut( button );
} );
