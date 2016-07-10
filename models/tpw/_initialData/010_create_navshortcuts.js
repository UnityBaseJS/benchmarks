/**
 * User: pavel.mash
 * Fill navigation shortcuts for TechemPower test
 */

/**
 * Initial script for create UnityBase TechEmPower test desktop navigation shortcuts
 * Used by cmd\initialize command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session) {
    "use strict";
    var desktopID, folderID,
        conn = session.connection;

    desktopID = conn.lookup('ubm_desktop', 'ID', {expression: 'code', condition: 'equal', values: {code: 'tpw_desktop'}});
    console.info('\tFill `TechEmPower` desktop');
    if (!desktopID) {
        console.info('\t\tcreate new `TechEmPower` desktop');
        desktopID = conn.insert({
            entity: 'ubm_desktop',
            fieldList: ['ID'],
            execParams: {
                code: 'tpw_desktop',
                caption: 'TechEmPower'
            }
        });
    } else {
        console.info('\t\tuse existed desktop with code `tpw_desktop`', desktopID)
    }

    console.log('\t\t\tcreate `World` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID: desktopID,
            parentID: null,
            code: 'tpw_world',
            caption: 'World',
            displayOrder: 10,
            cmdCode: JSON.stringify({cmdType: 'showList', cmdData: {params: [
                { entity: 'World', method: 'select', fieldList: ['ID', 'randomNumber']}
            ]}}, null, '\t')
        }
    });

    console.log('\t\t\tcreate `Fortune` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID: desktopID,
            parentID: null,
            code: 'tpw_fortune',
            caption: 'Fortune',
            displayOrder: 10,
            cmdCode: JSON.stringify({cmdType: 'showList', cmdData: {params: [
                { entity: 'Fortune', method: 'select', fieldList: ['ID', 'message']}
            ]}}, null, '\t')
        }
    });
};
