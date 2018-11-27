// <initial.js>
// Simulator of 2D Oritatami System.
// initialize OS-simulator's name space.
//  and a bit more..

//////////
// Grobal な 値の定義
INITIAL_GRID_SIZE_X = 64;
INITIAL_GRID_SIZE_Y = 64;

var nonDetRoutes = [];   // nondeterministic なとき, 複数のRouteを保存する用.
var nonDetHbonds = [];   // nondeterministic なとき, 複数のHbondの組を保存する用.


var adjacents = [ {x: 1, y: 0}, {x: -1, y: 0},
		  {x: 0, y: 1}, {x: 0,  y: -1},
		  {x: 1, y: 1}, {x: -1, y: -1} ];

// Oritataim System が持つべき変数群を収める名前空間.
var OSVars = {
    cons : {
	     alpha : 2,         // alpha, deltaはこの値を上書きする.
             delta : 3,
             len   : 15,        // 高分子鎖の長さ (seedも含める) .
	     beadTypeNum : 0    // 高分子の種類.
    },

    mode : { 
	indexEqualBeadtype : false
    },

    word   :   [ ],    // 高分子の鎖を順にならべたリスト.
    w_path :   [ ],    // 高分子の鎖が辿った点のリスト

    ruleset :  [],     // 高分子種どうしが水素結合を結べるかどうか定める. 2dMatrix.

    occupied : [],     // 点の占有情報. [(高分子種,index,hbond数)/false] を２次元配列で保存.
                       

    oc_size  : { x: INITIAL_GRID_SIZE_X, 
		 y: INITIAL_GRID_SIZE_Y },   // occupied配列の[縦/横]幅

    // bond_num :   [],   // 各高分子が結んでいるhbondの数(現在未使用)
    hbonds   :   [],   // 実際に形成されたhbondの情報 [pi,pj] (i != j) をもつ 

    step :   0,         // 最適化ステップの段階.1ずつ増える.
                       // 現在, indexいくつの高分子位置を最適化しているかを表す.
    initialStep : 0
};
//
//////////

initOccupied( INITIAL_GRID_SIZE_X, INITIAL_GRID_SIZE_Y );

// occupied配列の初期設定(seed)
var a = 1;
//beadtype912をグライダーの出口とする
//0からのターン
setSeed(10, 5, { beadType: 200, index: -3, bondNum: 1 });
setSeed(11, 5, { beadType: 201, index: -3, bondNum: 1 });
setSeed(12, 5, { beadType: 202, index: -3, bondNum: 1 });
setSeed(13, 5, { beadType: 203, index: -3, bondNum: 1 });
setSeed(14, 5, { beadType: 204, index: -3, bondNum: 1 });
setSeed(15, 5, { beadType: 205, index: -3, bondNum: 1 });
setSeed(16, 5, { beadType: 206, index: -3, bondNum: 1 });
setSeed(17, 5, { beadType: 207, index: -3, bondNum: 1 });
setSeed(10, 6, { beadType: 100, index: -3, bondNum: 1 });
setSeed(11, 7, { beadType: 101, index: -3, bondNum: 1 });
setSeed(12, 8, { beadType: 102, index: -3, bondNum: 1 });
setSeed(9, 5, { beadType: 0, index: -3, bondNum: 1 });
setSeed(9, 6, { beadType: 0, index: -3, bondNum: 1 });
setSeed(10, 7, { beadType: 0, index: -3, bondNum: 1 });
setSeed(11, 8, { beadType: 0, index: -3, bondNum: 1 });




//１からのターン
setSeed(30, 5, { beadType: 200, index: -3, bondNum: 1 });
setSeed(31, 5, { beadType: 201, index: -3, bondNum: 1 });
setSeed(32, 5, { beadType: 212, index: -3, bondNum: 1 });
setSeed(33, 5, { beadType: 213, index: -3, bondNum: 1 });
setSeed(34, 5, { beadType: 204, index: -3, bondNum: 1 });
setSeed(35, 5, { beadType: 205, index: -3, bondNum: 1 });
setSeed(36, 5, { beadType: 206, index: -3, bondNum: 1 });
setSeed(37, 5, { beadType: 207, index: -3, bondNum: 1 });
setSeed(30, 6, { beadType: 100, index: -3, bondNum: 1 });
setSeed(31, 7, { beadType: 101, index: -3, bondNum: 1 });
setSeed(32, 8, { beadType: 102, index: -3, bondNum: 1 });
setSeed(29, 5, { beadType: 0, index: -3, bondNum: 1 });
setSeed(29, 6, { beadType: 0, index: -3, bondNum: 1 });
setSeed(30, 7, { beadType: 0, index: -3, bondNum: 1 });
setSeed(31, 8, { beadType: 0, index: -3, bondNum: 1 });


if (a == 1) {
    OSVars.w_path = [
        { x: 10, y: 6 }
    ];
} else {
    OSVars.w_path = [
           { x: 30, y: 6 }
    ];
}


// seedとの境目がここで決まる.
OSVars.step = 1;
OSVars.initialStep = 1;

// len = 65??
