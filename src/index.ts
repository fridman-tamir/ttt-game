//main entry file

import "../public/style.css"
import {
    Xpell as _x,
    _xlog, //Xpell logger,
    XUI, //Xpell UI module,
    XData as _xd, //Xpell real-time data cache module
 }   from "xpell"

async function main() {
    _x.verbose() // enable verbose mode (xlog)
    // _x.info() // show xpell engine info
    _x.start() // start xpell engine (frame loop)
    _x.loadModule(XUI)

    const turn = "X"

    const board = [
        ["?", "?", "?"],
        ["?", "?", "?"],
        ["?", "?", "?"],
    ]

    //anonymous function to create row in the game board
    const createRow = (id:string,rowNum:number) => {
        const createCell = (id:string,cellNum:number) => {
            return {
                _type:"button",
                class:"ttt-board-button",
                _id:id,
                _text:"?",
                _on_click:(xobj, event) => {
                    if(_xd._o["ttt-turn"] === "X"){
                        xobj.setText("X")
                        xobj.dom.style.color = "white"
                        xobj.dom.style.backgroundColor = "black"
                        _xd._o["ttt-turn"] = "O"
                        board[rowNum][cellNum] = "X"
                    } else {
                        xobj.setText("O")
                        _xd._o["ttt-turn"] = "X"
                        board[rowNum][cellNum] = "O"
                        xobj.dom.style.color = "black"
                        xobj.dom.style.backgroundColor = "white"
                    }
                    //check for winner
                    let winner:any = undefined
                    for(let i=0; i<3; i++){
                        if(board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== "?"){
                            winner = board[i][0]
                        }
                    }
                    for(let i=0; i<3; i++){
                        if(board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== "?"){
                            winner = board[0][i]
                        }
                    }
                    if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== "?"){
                        winner = board[0][0]
                    }
                    if(winner)  {
                        const lbl = XUI.getObject("ttt-status")
                        lbl._data_source = undefined
                        lbl.setText("Player " + winner + " wins!")
                        lbl._on_frame = (xobj, frame) => {
                            //color =  frame * hsl
                            xobj.dom.style.color = "hsl(" + (frame * 10) + ", 100%, 50%)"
                        }
                    }
                    
                }
            }
        }


        return {
            _type:"view",
            _id:id,
            _children:[
                createCell(id+"-cell-1",0),
                createCell(id+"-cell-2",1),
                createCell(id+"-cell-3",2)
            ]
        }
    }



    //create main game tik-tak-toe scene
    const home = XUI.loadObject({
        _type:"view", //same as div 
        _id:"ttt-home",
        class:"ttt-home",
        _parent_element:"root",
        _children:[
            //add more views here
            {
                _type:"view",
                _id:"ttt-title",
                _text:"Tik-Tak-Toe",
                style:"font-size: 2em; margin-bottom: 20px;"                
            },
            {
                _type:"view",
                _id:"ttt-board",
                _children:[
                    createRow("row-1",0),
                    createRow("row-2",1),
                    createRow("row-3",2)
                    
                ]
            },
            {
                _type:"view",
                _id:"ttt-status",
                _text:"Player ?'s turn",
                _data_source : "ttt-turn",
                _on_data:(xobj, data) => {
                    xobj.setText ( "Player " + data + "'s turn")
                },
                style:"font-size: 1.5em; margin-top: 20px;"
            }
        ]
    })


    //set _xdata for the game
    _xd._o["ttt-turn"] = turn
}


main()