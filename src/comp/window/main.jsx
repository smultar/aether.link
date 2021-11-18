import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function Component({ config, window, history}) {
    const [file, setFile] = useState([]);
    const [origin, setOrigin] = useState('');
    const [editor, setEditor] = useState({mods: [], content: { name: '', description: 'No description provided, would you like to add one?', author: '', version: ''}, file: { name: '', content: ''}, selected: null});

    const [selected, setSelected] = useState({options: [
        {label: 'Body', value: 'Body'}, 
        {label: 'Legs', value: 'Legs'},
        {label: 'Legs', value: 'Legs'},
        {label: 'Legs', value: 'Legs'},
        {label: 'Legs', value: 'Legs'},
        {label: 'Legs', value: 'Legs'},
    ], selected: {}, load: true});

    // separates object into array of objects by name
    const handleChange = async () => {
        let file = await window.link.action.fetchFile();
        
        if (file) {
            let content = window.link.internal.unpack(file);
            let read = JSON.parse(content); console.log(read);

            setFile(read); setOrigin(file);
            
            let newEditor = Object.assign({}, editor);
            console.log(editor)
            console.log(newEditor);
            newEditor.mods = separate(read); 
            newEditor.content.name = read.Name; 
            //newEditor.content.description = read?.Description ? read.Description : 'No description provided, would you like to add one?'; 
            //newEditor.content.author = read?.Author ? read.Author : 'No Author';
            //newEditor.content.version = read?.Version ? read.Version : 'Error';

            setEditor(newEditor);
        }
    };
    
    const separate = (target) => {  
        let pairedByName = [];

        if (target?.SimpleModsList?.length > 0) {
            target.SimpleModsList.forEach((mod, index) => { 
                
                if (pairedByName.filter(currentMod => ((currentMod.name == mod.Name) && (currentMod.category == mod.Category))).length !== 0) {
                    pairedByName.find(currentMod => ((currentMod.name == mod.Name) && (currentMod.category == mod.Category))).mods.push(mod);
                    
                } else {
                    pairedByName.push({name: mod.Name, category: mod.Category, mods: [mod]});
                }
    
                if (index == target.SimpleModsList.length - 1) {
                    console.log(pairedByName);
                    return pairedByName;
                }
            });

        } else {
            pairedByName.push({name: target.Name, category: target.Category, mods: [target], single: true});
        }


        return pairedByName;
    };

    const targetEditor = (target) => {

        let newEditor = Object.assign({}, editor);
        newEditor.selected = target;
        
        let newSelected = Object.assign({}, selected);
        newSelected.selected = newSelected.options[(newSelected.options.findIndex(option => option.value === editor.mods[newEditor.selected]?.category))]
        console.log(newSelected.options.findIndex(option => option.value === editor.mods[newEditor.selected]?.category));
        console.log (target)
        
        newSelected.load = false;

        setSelected(newSelected); setEditor(newEditor); 

        console.log(selected)
    }

    const editName = (content) => {
        let newEditor = Object.assign({}, editor);
        newEditor.content.name = content;
        setEditor(newEditor);
    }

    const editAuthor = (content) => {
        let newEditor = Object.assign({}, editor);
        newEditor.content.author = content;
        setEditor(newEditor);
    }

    const editDescription = (content) => {
        let newEditor = Object.assign({}, editor);
        newEditor.content.description = content;
        setEditor(newEditor);
    }

    const editModName = (content) => {
        let newEditor = Object.assign({}, editor);
        newEditor.mods[editor.selected].name = content;
        setEditor(newEditor);
    }

    const exportPack = async (editor) => {
        let saveFile = await window.link.action.saveFile();

        let pack = Object.assign({}, file);

        if (editor.mods[0]?.single) {
            pack.Name = editor.content.name;
            pack.Description = editor.content.description;
            pack.Author = editor.content.author;
            //pack.Version = '1.0.1';
            
            pack.Category = editor.mods[0].mods[0].Category;
            pack.DatFile = editor.mods[0].mods[0].DatFile;
            pack.ModOffset = editor.mods[0].mods[0].ModOffset;
            pack.ModSize = editor.mods[0].mods[0].ModSize;
            pack.FullPath = editor.mods[0].mods[0].FullPath;
            console.log(pack);

            await window.link.internal.export(origin, saveFile, pack);


        } else {

            pack.Name = editor.content.name;
            pack.Description = editor.content.description;
            pack.Author = editor.content.author;
            pack.Version = editor.content.version;
    
            let modList = [];
    
            editor.mods.forEach((parent, index) => { 
                
                console.log(parent);
                let updatedList = parent.mods.map(child => {
    
                    return {
                        Name: parent.name,
                        Category: parent.category,
                        FullPath: child.FullPath,
                        ModOffset: child.ModOffset,
                        ModSize: child.ModSize,
                        ModPackEntry: {name: child.Name, author: editor.content.author, version: editor.content.version, url: ''}
                    }
                })
    
                modList.push(...updatedList);
            });
    
    
            console.log(modList)
    
            pack.SimpleModsList = modList;
    
            console.log(pack);
            console.log(origin);
            await window.link.internal.export(origin, saveFile, pack);
        }


    }

    //TTMPD.mpd "TTMPL.mpl"
    
    return (
        <div id="dock-render">

            <div id="dock-render-content">
                {/* Header */}
                <div id="header">
                    <div className="header-title">
                        <p className="title">TTMP Tweaker</p>
                        <p className="link">Issues</p>
                        <p className="link">Changes</p>
                        <div className="load-file" onClick={() => {exportPack(editor)}}>Select a file</div>

                    </div>
                    <p className="description">Modify <span className="tag">.ttmp</span> files without all the hassle.</p>
                </div>
                {/* Body */}
                <div id="body">

                    <div className="body-pri">
                        {/* File */}
                        { (file <= 0) && 
                            <div className="body-empty">
                                <div className="not-loaded">
                                    <img className="icon" src="svg/file.svg"></img>
                                    <div className="title">Getting started</div>
                                    <div className="description">Select a file anywhere on your pc, so we can get started</div>
                                    <div className="load-file" onClick={() => {handleChange()}}>Select a file</div>
                                </div>
                            </div>
                        }

                        
                        {/* Editor */}
                        { (file != 0) && 
                        <div className="body-filled">
                            <input className="title-input" type="text" placeholder="Name" value={editor.content.name} size={editor.content.name.length - 3}  onChange={event => {editName(event.target.value)}} ></input>
                            
                            <div className="authver">
                                <input className="author-input" type="text" placeholder="Name" value={editor.content.author} size={editor.content.author.length - 4} onChange={event => {editAuthor(event.target.value)}}></input>
                                <p>- {editor.content.version}</p>
                            </div>
                            <input className="description-input" type="text" placeholder="No description provided, would you like to add one?" value={editor.content.description} size={editor.content.description.length - 4} onChange={event => {editDescription(event.target.value)}}></input>
                            <div className="title-bar">
                                <p>Modpacks ({editor.mods.length})</p>
                                <p>Category</p>
                            </div>
                            <div className="modpacks">
                                { (editor.content !== []) && editor.mods.map((mod, index) => {
                                    return (
                                        <div key={index} className={(editor.selected == index) ? 'modpack active' : 'modpack'} onClick={() => {targetEditor(index)}}>
                                            <p className="name">{mod?.name}</p>
                                            <p className="category">{mod?.category}</p>
                                        </div>
                                    )
                                    })
                                }
                            </div>
                        </div>
                        }


                    </div>

                    <div className="body-sec">
                        <Select value={selected.selected} isLoading={selected.load} placeholder="Pending" classNamePrefix="react-select" options={selected.options} onChange={(value) => console.log(value)}/>
                        <input className="input" type="text" placeholder="Name" value={editor.mods[editor.selected]?.name} onChange={event => {editModName(event.target.value)}}></input>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};
  
  export default Component;
  