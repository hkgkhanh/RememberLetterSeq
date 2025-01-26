// Vars
var full_cube = new Array(54); // Position of all 54 stickers in the cube
var corners   = new Array(24); // Position of all 24 corner stickers in the cube
var edges     = new Array(24); // Position of all 24 edge stickers in the cube
var centers   = new Array(6);  // Position of all 6 edge stickers in the cube

// Constants
var colors = new Array(6);
colors[0] = '#FFFFFF';
colors[1] = '#FF9900';
colors[2] = '#00FF00';
colors[3] = '#FF0000';
colors[4] = '#0000FF';
colors[5] = '#FFFF00';

var CORNERS = 0;
var EDGES   = 1;
var CENTERS = 2;
var BH      = 0;
var M2      = 1;
var OP      = 2;
var corner_style = BH;
var edge_style   = BH;

// Speffz
var A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8, J=9, K=10, L=11, M=12, N=13, O=14, P=15, Q=16, R=17, S=18, T=19, U=20, V=21, W=22, X=23, Z=-1;
var intToLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];

var corners_to_full = [0, 6, 8, 2, 9,  15, 17, 11, 18, 24, 26, 20, 27, 33, 35, 29, 36, 42, 44, 38, 45, 51, 53, 47]; // Mapping of corners array to full cube
var edges_to_full   = [3, 7, 5, 1, 12, 16, 14, 10, 21, 25, 23, 19, 30, 34, 32, 28, 39, 43, 41, 37, 48, 52, 50, 46]; // Mapping of edges array to full cube
var centers_to_full = [4, 13, 22, 31, 40, 49]; // Mapping of centers array to full cube

// Edge and corner cubies
// Sticker in position 0,0 of cubie arrays represents the buffer
var corner_cubies  = [[A,E,R],[B,Q,N],[C,M,J],[D,I,F],[U,G,L],[V,K,P],[W,O,T],[X,S,H]];
var solved_corners = [true, true, true, true, true, true, true, true];
var corner_cycles  = [];
var cw_corners     = [];
var ccw_corners    = [];
var edge_cubies    = [[U,K],[A,Q],[B,M],[C,I],[D,E],[R,H],[T,N],[L,F],[J,P],[V,O],[W,S],[X,G]];
var solved_edges   = [true, true, true, true, true, true, true, true, true, true, true, true];
var edge_cycles    = [];
var flipped_edges  = [];
var rotations      = [];

// Definitions of available permutations
var permutations = {
    // Outer layers
    "U"  : {0:[B,C,D,A,Q,R,Z,Z,E,F,Z,Z,I,J,Z,Z,M,N,Z,Z,Z,Z,Z,Z], 1:[B,C,D,A,Q,Z,Z,Z,E,Z,Z,Z,I,Z,Z,Z,M,Z,Z,Z,Z,Z,Z,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "U'" : {0:[D,A,B,C,I,J,Z,Z,M,N,Z,Z,Q,R,Z,Z,E,F,Z,Z,Z,Z,Z,Z], 1:[D,A,B,C,I,Z,Z,Z,M,Z,Z,Z,Q,Z,Z,Z,E,Z,Z,Z,Z,Z,Z,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "U2" : {0:[C,D,A,B,M,N,Z,Z,Q,R,Z,Z,E,F,Z,Z,I,J,Z,Z,Z,Z,Z,Z], 1:[C,D,A,B,M,Z,Z,Z,Q,Z,Z,Z,E,Z,Z,Z,I,Z,Z,Z,Z,Z,Z,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "F"  : {0:[Z,Z,P,M,Z,C,D,Z,J,K,L,I,V,Z,Z,U,Z,Z,Z,Z,F,G,Z,Z], 1:[Z,Z,P,Z,Z,C,Z,Z,J,K,L,I,Z,Z,Z,U,Z,Z,Z,Z,F,Z,Z,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "F'" : {0:[Z,Z,F,G,Z,U,V,Z,L,I,J,K,D,Z,Z,C,Z,Z,Z,Z,P,M,Z,Z], 1:[Z,Z,F,Z,Z,U,Z,Z,L,I,J,K,Z,Z,Z,C,Z,Z,Z,Z,P,Z,Z,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "F2" : {0:[Z,Z,U,V,Z,P,M,Z,K,L,I,J,G,Z,Z,F,Z,Z,Z,Z,C,D,Z,Z], 1:[Z,Z,U,Z,Z,P,Z,Z,K,L,I,J,Z,Z,Z,F,Z,Z,Z,Z,C,Z,Z,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "R"  : {0:[Z,T,Q,Z,Z,Z,Z,Z,Z,B,C,Z,N,O,P,M,W,Z,Z,V,Z,J,K,Z], 1:[Z,T,Z,Z,Z,Z,Z,Z,Z,B,Z,Z,N,O,P,M,Z,Z,Z,V,Z,J,Z,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "R'" : {0:[Z,J,K,Z,Z,Z,Z,Z,Z,V,W,Z,P,M,N,O,C,Z,Z,B,Z,T,Q,Z], 1:[Z,J,Z,Z,Z,Z,Z,Z,Z,V,Z,Z,P,M,N,O,Z,Z,Z,B,Z,T,Z,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "R2" : {0:[Z,V,W,Z,Z,Z,Z,Z,Z,T,Q,Z,O,P,M,N,K,Z,Z,J,Z,B,C,Z], 1:[Z,V,Z,Z,Z,Z,Z,Z,Z,T,Z,Z,O,P,M,N,Z,Z,Z,J,Z,B,Z,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "L"  : {0:[I,Z,Z,L,F,G,H,E,U,Z,Z,X,Z,Z,Z,Z,Z,D,A,Z,S,Z,Z,R], 1:[Z,Z,Z,L,F,G,H,E,Z,Z,Z,X,Z,Z,Z,Z,Z,D,Z,Z,Z,Z,Z,R], 2:[Z,Z,Z,Z,Z,Z]},
    "L'" : {0:[S,Z,Z,R,H,E,F,G,A,Z,Z,D,Z,Z,Z,Z,Z,X,U,Z,I,Z,Z,L], 1:[Z,Z,Z,R,H,E,F,G,Z,Z,Z,D,Z,Z,Z,Z,Z,X,Z,Z,Z,Z,Z,L], 2:[Z,Z,Z,Z,Z,Z]},
    "L2" : {0:[U,Z,Z,X,G,H,E,F,S,Z,Z,R,Z,Z,Z,Z,Z,L,I,Z,A,Z,Z,D], 1:[Z,Z,Z,X,G,H,E,F,Z,Z,Z,R,Z,Z,Z,Z,Z,L,Z,Z,Z,Z,Z,D], 2:[Z,Z,Z,Z,Z,Z]},
    "B"  : {0:[H,E,Z,Z,X,Z,Z,W,Z,Z,Z,Z,Z,A,B,Z,R,S,T,Q,Z,Z,N,O], 1:[H,Z,Z,Z,Z,Z,Z,W,Z,Z,Z,Z,Z,A,Z,Z,R,S,T,Q,Z,Z,N,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "B'" : {0:[N,O,Z,Z,B,Z,Z,A,Z,Z,Z,Z,Z,W,X,Z,T,Q,R,S,Z,Z,H,E], 1:[N,Z,Z,Z,Z,Z,Z,A,Z,Z,Z,Z,Z,W,Z,Z,T,Q,R,S,Z,Z,H,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "B2" : {0:[W,X,Z,Z,O,Z,Z,N,Z,Z,Z,Z,Z,H,E,Z,S,T,Q,R,Z,Z,A,B], 1:[W,Z,Z,Z,Z,Z,Z,N,Z,Z,Z,Z,Z,H,Z,Z,S,T,Q,R,Z,Z,A,Z], 2:[Z,Z,Z,Z,Z,Z]},
    "D"  : {0:[Z,Z,Z,Z,Z,Z,K,L,Z,Z,O,P,Z,Z,S,T,Z,Z,G,H,V,W,X,U], 1:[Z,Z,Z,Z,Z,Z,K,Z,Z,Z,O,Z,Z,Z,S,Z,Z,Z,G,Z,V,W,X,U], 2:[Z,Z,Z,Z,Z,Z]},
    "D'" : {0:[Z,Z,Z,Z,Z,Z,S,T,Z,Z,G,H,Z,Z,K,L,Z,Z,O,P,X,U,V,W], 1:[Z,Z,Z,Z,Z,Z,S,Z,Z,Z,G,Z,Z,Z,K,Z,Z,Z,O,Z,X,U,V,W], 2:[Z,Z,Z,Z,Z,Z]},
    "D2" : {0:[Z,Z,Z,Z,Z,Z,O,P,Z,Z,S,T,Z,Z,G,H,Z,Z,K,L,W,X,U,V], 1:[Z,Z,Z,Z,Z,Z,O,Z,Z,Z,S,Z,Z,Z,G,Z,Z,Z,K,Z,W,X,U,V], 2:[Z,Z,Z,Z,Z,Z]},

    // Slices
    "E"  : {0:[Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z], 1:[Z,Z,Z,Z,Z,J,Z,L,Z,N,Z,P,Z,R,Z,T,Z,F,Z,H,Z,Z,Z,Z], 2:[Z,2,3,4,1,Z]},
    "E'" : {0:[Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z], 1:[Z,Z,Z,Z,Z,R,Z,T,Z,F,Z,H,Z,J,Z,L,Z,N,Z,P,Z,Z,Z,Z], 2:[Z,4,1,2,3,Z]},
    "E2" : {0:[Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z], 1:[Z,Z,Z,Z,Z,N,Z,P,Z,R,Z,T,Z,F,Z,H,Z,J,Z,L,Z,Z,Z,Z], 2:[Z,3,4,1,2,Z]},
    "S"  : {0:[Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z], 1:[Z,O,Z,M,B,Z,D,Z,Z,Z,Z,Z,V,Z,X,Z,Z,Z,Z,Z,Z,G,Z,E], 2:[3,0,Z,5,Z,1]},
    "S'" : {0:[Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z], 1:[Z,E,Z,G,X,Z,V,Z,Z,Z,Z,Z,D,Z,B,Z,Z,Z,Z,Z,Z,M,Z,O], 2:[1,5,Z,0,Z,3]},
    "S2" : {0:[Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z], 1:[Z,X,Z,V,O,Z,M,Z,Z,Z,Z,Z,G,Z,E,Z,Z,Z,Z,Z,Z,D,Z,B], 2:[5,3,Z,1,Z,0]},
    "M"  : {0:[Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z], 1:[I,Z,K,Z,Z,Z,Z,Z,U,Z,W,Z,Z,Z,Z,Z,C,Z,A,Z,S,Z,Q,Z], 2:[2,Z,5,Z,0,4]},
    "M'" : {0:[Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z], 1:[S,Z,Q,Z,Z,Z,Z,Z,A,Z,C,Z,Z,Z,Z,Z,W,Z,U,Z,I,Z,K,Z], 2:[4,Z,0,Z,5,2]},
    "M2" : {0:[Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z], 1:[U,Z,W,Z,Z,Z,Z,Z,S,Z,Q,Z,Z,Z,Z,Z,K,Z,I,Z,A,Z,C,Z], 2:[5,Z,4,Z,2,0]},

    // Double layer
    "u"  : {0:[B,C,D,A,Q,R,Z,Z,E,F,Z,Z,I,J,Z,Z,M,N,Z,Z,Z,Z,Z,Z], 1:[B,C,D,A,Q,R,Z,T,E,F,Z,H,I,J,Z,L,M,N,Z,P,Z,Z,Z,Z], 2:[Z,4,1,2,3,Z]},
    "u'" : {0:[D,A,B,C,I,J,Z,Z,M,N,Z,Z,Q,R,Z,Z,E,F,Z,Z,Z,Z,Z,Z], 1:[D,A,B,C,I,J,Z,L,M,N,Z,P,Q,R,Z,T,E,F,Z,H,Z,Z,Z,Z], 2:[Z,2,3,4,1,Z]},
    "u2" : {0:[C,D,A,B,M,N,Z,Z,Q,R,Z,Z,E,F,Z,Z,I,J,Z,Z,Z,Z,Z,Z], 1:[C,D,A,B,M,N,Z,P,Q,R,Z,T,E,F,Z,H,I,J,Z,L,Z,Z,Z,Z], 2:[Z,3,4,1,2,Z]},
    "f"  : {0:[Z,Z,P,M,Z,C,D,Z,J,K,L,I,V,Z,Z,U,Z,Z,Z,Z,F,G,Z,Z], 1:[Z,O,P,M,B,C,D,Z,J,K,L,I,V,Z,X,U,Z,Z,Z,Z,F,G,Z,E], 2:[3,0,Z,5,Z,1]},
    "f'" : {0:[Z,Z,F,G,Z,U,V,Z,L,I,J,K,D,Z,Z,C,Z,Z,Z,Z,P,M,Z,Z], 1:[Z,E,F,G,X,U,V,Z,L,I,J,K,D,Z,B,C,Z,Z,Z,Z,P,M,Z,O], 2:[1,5,Z,0,Z,3]},
    "f2" : {0:[Z,Z,U,V,Z,P,M,Z,K,L,I,J,G,Z,Z,F,Z,Z,Z,Z,C,D,Z,Z], 1:[Z,X,U,V,O,P,M,Z,K,L,I,J,G,Z,E,F,Z,Z,Z,Z,C,D,Z,B], 2:[5,3,Z,1,Z,0]},
    "r"  : {0:[Z,T,Q,Z,Z,Z,Z,Z,Z,B,C,Z,N,O,P,M,W,Z,Z,V,Z,J,K,Z], 1:[S,T,Q,Z,Z,Z,Z,Z,A,B,C,Z,N,O,P,M,W,Z,U,V,I,J,K,Z], 2:[4,Z,0,Z,5,2]},
    "r'" : {0:[Z,J,K,Z,Z,Z,Z,Z,Z,V,W,Z,P,M,N,O,C,Z,Z,B,Z,T,Q,Z], 1:[I,J,K,Z,Z,Z,Z,Z,U,V,W,Z,P,M,N,O,C,Z,A,B,S,T,Q,Z], 2:[2,Z,5,Z,0,4]},
    "r2" : {0:[Z,V,W,Z,Z,Z,Z,Z,Z,T,Q,Z,O,P,M,N,K,Z,Z,J,Z,B,C,Z], 1:[U,V,W,Z,Z,Z,Z,Z,S,T,Q,Z,O,P,M,N,K,Z,I,J,A,B,C,Z], 2:[5,Z,4,Z,2,0]},
    "l"  : {0:[I,Z,Z,L,F,G,H,E,U,Z,Z,X,Z,Z,Z,Z,Z,D,A,Z,S,Z,Z,R], 1:[I,Z,K,L,F,G,H,E,U,Z,W,X,Z,Z,Z,Z,C,D,A,Z,S,Z,Q,R], 2:[2,Z,5,Z,0,4]},
    "l'" : {0:[S,Z,Z,R,H,E,F,G,A,Z,Z,D,Z,Z,Z,Z,Z,X,U,Z,I,Z,Z,L], 1:[S,Z,Q,R,H,E,F,G,A,Z,C,D,Z,Z,Z,Z,W,X,U,Z,I,Z,K,L], 2:[4,Z,0,Z,5,2]},
    "l2" : {0:[U,Z,Z,X,G,H,E,F,S,Z,Z,R,Z,Z,Z,Z,Z,L,I,Z,A,Z,Z,D], 1:[U,Z,W,X,G,H,E,F,S,Z,Q,R,Z,Z,Z,Z,K,L,I,Z,A,Z,C,D], 2:[5,Z,4,Z,2,0]},
    "b"  : {0:[H,E,Z,Z,X,Z,Z,W,Z,Z,Z,Z,Z,A,B,Z,R,S,T,Q,Z,Z,N,O], 1:[H,E,Z,G,X,Z,V,W,Z,Z,Z,Z,D,A,B,Z,R,S,T,Q,Z,M,N,O], 2:[1,5,Z,0,Z,3]},
    "b'" : {0:[N,O,Z,Z,B,Z,Z,A,Z,Z,Z,Z,Z,W,X,Z,T,Q,R,S,Z,Z,H,E], 1:[N,O,Z,M,B,Z,D,A,Z,Z,Z,Z,V,W,X,Z,T,Q,R,S,Z,G,H,E], 2:[3,0,Z,5,Z,1]},
    "b2" : {0:[W,X,Z,Z,O,Z,Z,N,Z,Z,Z,Z,Z,H,E,Z,S,T,Q,R,Z,Z,A,B], 1:[W,X,Z,V,O,Z,M,N,Z,Z,Z,Z,G,H,E,Z,S,T,Q,R,Z,D,A,B], 2:[5,3,Z,1,Z,0]},
    "d"  : {0:[Z,Z,Z,Z,Z,Z,K,L,Z,Z,O,P,Z,Z,S,T,Z,Z,G,H,V,W,X,U], 1:[Z,Z,Z,Z,Z,J,K,L,Z,N,O,P,Z,R,S,T,Z,F,G,H,V,W,X,U], 2:[Z,2,3,4,1,Z]},
    "d'" : {0:[Z,Z,Z,Z,Z,Z,S,T,Z,Z,G,H,Z,Z,K,L,Z,Z,O,P,X,U,V,W], 1:[Z,Z,Z,Z,Z,R,S,T,Z,F,G,H,Z,J,K,L,Z,N,O,P,X,U,V,W], 2:[Z,4,1,2,3,Z]},
    "d2" : {0:[Z,Z,Z,Z,Z,Z,O,P,Z,Z,S,T,Z,Z,G,H,Z,Z,K,L,W,X,U,V], 1:[Z,Z,Z,Z,Z,N,O,P,Z,R,S,T,Z,F,G,H,Z,J,K,L,W,X,U,V], 2:[Z,3,4,1,2,Z]},

    // Rotations
    "x"  : {0:[S,T,Q,R,H,E,F,G,A,B,C,D,N,O,P,M,W,X,U,V,I,J,K,L], 1:[S,T,Q,R,H,E,F,G,A,B,C,D,N,O,P,M,W,X,U,V,I,J,K,L], 2:[4,Z,0,Z,5,2]},
    "x'" : {0:[I,J,K,L,F,G,H,E,U,V,W,X,P,M,N,O,C,D,A,B,S,T,Q,R], 1:[I,J,K,L,F,G,H,E,U,V,W,X,P,M,N,O,C,D,A,B,S,T,Q,R], 2:[2,Z,5,Z,0,4]},
    "x2" : {0:[U,V,W,X,G,H,E,F,S,T,Q,R,O,P,M,N,K,L,I,J,A,B,C,D], 1:[U,V,W,X,G,H,E,F,S,T,Q,R,O,P,M,N,K,L,I,J,A,B,C,D], 2:[5,Z,4,Z,2,0]},
    "y"  : {0:[B,C,D,A,Q,R,S,T,E,F,G,H,I,J,K,L,M,N,O,P,X,U,V,W], 1:[B,C,D,A,Q,R,S,T,E,F,G,H,I,J,K,L,M,N,O,P,X,U,V,W], 2:[Z,4,1,2,3,Z]},
    "y'" : {0:[D,A,B,C,I,J,K,L,M,N,O,P,Q,R,S,T,E,F,G,H,V,W,X,U], 1:[D,A,B,C,I,J,K,L,M,N,O,P,Q,R,S,T,E,F,G,H,V,W,X,U], 2:[Z,2,3,4,1,Z]},
    "y2" : {0:[C,D,A,B,M,N,O,P,Q,R,S,T,E,F,G,H,I,J,K,L,W,X,U,V], 1:[C,D,A,B,M,N,O,P,Q,R,S,T,E,F,G,H,I,J,K,L,W,X,U,V], 2:[Z,3,4,1,2,Z]},
    "z"  : {0:[N,O,P,M,B,C,D,A,J,K,L,I,V,W,X,U,T,Q,R,S,F,G,H,E], 1:[N,O,P,M,B,C,D,A,J,K,L,I,V,W,X,U,T,Q,R,S,F,G,H,E], 2:[3,0,Z,5,Z,1]},
    "z'" : {0:[H,E,F,G,X,U,V,W,L,I,J,K,D,A,B,C,R,S,T,Q,P,M,N,O], 1:[H,E,F,G,X,U,V,W,L,I,J,K,D,A,B,C,R,S,T,Q,P,M,N,O], 2:[1,5,Z,0,Z,3]},
    "z2" : {0:[W,X,U,V,O,P,M,N,K,L,I,J,G,H,E,F,S,T,Q,R,C,D,A,B], 1:[W,X,U,V,O,P,M,N,K,L,I,J,G,H,E,F,S,T,Q,R,C,D,A,B], 2:[5,3,Z,1,Z,0]}
};

// Sets cube to solved position
function resetCube(){
    // Corners and edges are initialized in solved position
    for (var i=0; i<24; i++ ){
        corners[i] = i;
        edges[i]   = i;
    }

    // Centers are initialized in the solved position
    centers[0] = A;
    centers[1] = E;
    centers[2] = I;
    centers[3] = M;
    centers[4] = Q;
    centers[5] = U;
}

// Perform a permutation on the cube
function permute ( permutation ){
    var exchanges = [Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z];
    // Corners are permuted
    var perm = permutations[permutation][CORNERS];
    for (var i=0; i<24; i++){
        if ( perm[i] != Z ){
            exchanges[perm[i]] = corners[i];
        }
    }
    for (var i=0; i<24; i++){
        if ( exchanges[i] != Z ){
            corners[i] = exchanges[i];
        }
    }

    // Edges are permuted
    exchanges = [Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z];
    perm = permutations[permutation][EDGES];
    for (var i=0; i<24; i++){
        if ( perm[i] != Z ){
            exchanges[perm[i]] = edges[i];
        }
    }
    for (var i=0; i<24; i++){
        if ( exchanges[i] != Z ){
            edges[i] = exchanges[i];
        }
    }

    // Centers are permuted
    exchanges = [Z,Z,Z,Z,Z,Z];
    perm = permutations[permutation][CENTERS];
    for (var i=0; i<6; i++){
        if ( perm[i] != Z ){
            exchanges[perm[i]] = centers[i];
        }
    }
    for (var i=0; i<6; i++){
        if ( exchanges[i] != Z ){
            centers[i] = exchanges[i];
        }
    }
}

// Returns sticker color of the received position
function getColorFromSpeffz(position){
    var color_index = 0;
    for ( var i=1; i<6; i++ ){
        if ( position >= i*4 ){
            color_index = i;
        }
        else {
            break;
        }
    }
    return colors[color_index];
}

// Sets the cube to solved state and applies scramble
function scrambleCube(scramble_str){
    resetCube();

    // unrecognized moves are ignored
    var valid_permutations = ["U","U'","U2","L","L'","L2","F","F'","F2","R","R'","R2","B","B'","B2","D","D'","D2","M","M'","M2","S","S'","S2","E","E'","E2","u","u'","u2","l","l'","l2","f","f'","f2","r","r'","r2","b","b'","b2","d","d'","d2","x","x'","x2","y","y'","y2","z","z'","z2"];
    var scramble = scramble_str.split(" ");
    var permutations = [];
    for (var i=0; i<scramble.length; i++ ){
        if ( valid_permutations.indexOf(scramble[i]) != -1 ){
            permutations.push(scramble[i]);
        }
        else if ( scramble[i] != '' ) {
            is_valid_scramble = false;
        }
    }

    // Permutations are applied to the solved cube
    for (var i=0; i<permutations.length; i++ ){
        permute(permutations[i]);
    }

    // Corners and edges are set as unsolved
    for (var i=0; i<8; i++){
        solved_corners[i] = false;
    }
    for (var i=0; i<12; i++){
        solved_edges[i] = false;
    }
}

// Finds a BLD solution for the cube in its current state
function solveCube(){
    orientCube();
    solveCorners();
    solveEdges();

    // console.log("edge cycles: " + edge_cycles);
    // console.log("flip edge: " + flipped_edges);
    // console.log("corner cycles: " + corner_cycles);
    // console.log("ccw corner: " + ccw_corners);
    // console.log("cw corner: " + cw_corners);
}

// Changes the solving orientation of the cube
function changeOrientation (permutation){
    // Colors are permuted
    exchanges = [Z,Z,Z,Z,Z,Z];
    perm = permutations[permutation][CENTERS];
    for (var i=0; i<6; i++){
        if ( perm[i] != Z ){
            exchanges[perm[i]] = colors[i];
        }
    }
    for (var i=0; i<6; i++){
        if ( exchanges[i] != Z ){
            colors[i] = exchanges[i];
        }
    }
}

// Rotates the cube into the solving orientation
function orientCube(){
    rotations = [];

    // Position of the top center is found
    var top_position = 0;
    for (var i=0; i<6 ; i++){
        if ( centers[i] == A ){
            top_position = i;
            break;
        }
    }

    // Cube is rotated to place the top orientation center in the U face
    switch ( top_position ){
        case 1: permute("z");  rotations.push("z");  break;
        case 2: permute("x");  rotations.push("x");  break;
        case 3: permute("z'"); rotations.push("z'"); break;
        case 4: permute("x'"); rotations.push("x'"); break;
        case 5:
            if ( centers[2] == I ) {
                permute("z2");
                rotations.push("z2");
            }
            else {
                permute("x2");
                rotations.push("x2");
            }
            break;
    }

    // Position of the front center is found
    var front_position = 0;
    for (var i=1; i<5 ; i++){
        if ( centers[i] == I ){
            front_position = i;
            break;
        }
    }

    // Cube is rotated to place the front orientation center in the F face
    switch ( front_position ){
        case 1: permute("y'"); rotations.push("y'"); break;
        case 3: permute("y");  rotations.push("y");  break;
        case 4: permute("y2"); rotations.push("y2"); break;
    }
}

// Solves all 8 corners in the cube
// Ignores miss-oriented corners
function solveCorners(){
    corner_cycles = [];
    cw_corners    = [];
    ccw_corners   = [];
    while ( !cornersSolved() ){
        cycleCornerBuffer();
    }
}

// Replaces the corner buffer with another corner
function cycleCornerBuffer(){
    var corner_cycled = false;

    // If the buffer is solved, replace it with an unsolved corner
    if ( solved_corners[0] ){
        // First unsolved corner is selected
        for (var i=1; i<8 && !corner_cycled; i++){
            if ( !solved_corners[i] ){
                // Buffer is placed in a... um... buffer
                var temp_corner = [corners[corner_cubies[0][0]], corners[corner_cubies[0][1]], corners[corner_cubies[0][2]]];

                // Buffer corner is replaced with corner
                corners[corner_cubies[0][0]] = corners[corner_cubies[i][0]];
                corners[corner_cubies[0][1]] = corners[corner_cubies[i][1]];
                corners[corner_cubies[0][2]] = corners[corner_cubies[i][2]];

                // Corner is replaced with buffer
                corners[corner_cubies[i][0]] = temp_corner[0];
                corners[corner_cubies[i][1]] = temp_corner[1];
                corners[corner_cubies[i][2]] = temp_corner[2];

                // Corner cycle is inserted into solution array
                corner_cycles.push( corner_cubies[i][0] );
                corner_cycled = true;
            }
        }
    }
    // If the buffer is not solved, swap it to the position where the corner belongs
    else {
        for (var i=0; i<8 && !corner_cycled; i++){
            for (var j=0; j<3 && !corner_cycled; j++){
                if ( corners[corner_cubies[0][0]] == corner_cubies[i][j%3] && corners[corner_cubies[0][1]] == corner_cubies[i][(j+1)%3] && corners[corner_cubies[0][2]] == corner_cubies[i][(j+2)%3] ){
                    // Buffer corner is replaced with corner
                    corners[corner_cubies[0][0]] = corners[corner_cubies[i][j%3]];
                    corners[corner_cubies[0][1]] = corners[corner_cubies[i][(j+1)%3]];
                    corners[corner_cubies[0][2]] = corners[corner_cubies[i][(j+2)%3]];

                    // Corner is solved
                    corners[corner_cubies[i][0]] = corner_cubies[i][0];
                    corners[corner_cubies[i][1]] = corner_cubies[i][1];
                    corners[corner_cubies[i][2]] = corner_cubies[i][2];

                    // Corner cycle is inserted into solution array
                    corner_cycles.push( corner_cubies[i][j%3] );
                    corner_cycled = true;
                }
            }
        }
    }
}

// Checks if all 8 corners are already solved
function cornersSolved (){
    var corners_solved = true;

    // Check if corners marked as unsolved haven't been solved yet
    for (var i=0; i<8; i++){
        if ( i==0 || !solved_corners[i] ){
            // Corner is solved and oriented
            if ( corners[corner_cubies[i][0]] == corner_cubies[i][0] && corners[corner_cubies[i][1]] == corner_cubies[i][1] && corners[corner_cubies[i][2]] == corner_cubies[i][2] ) {
                solved_corners[i] = true;
            }
            // Corner is in correct position but needs to be rotated clockwise
            else if ( corners[corner_cubies[i][0]] == corner_cubies[i][1] && corners[corner_cubies[i][1]] == corner_cubies[i][2] && corners[corner_cubies[i][2]] == corner_cubies[i][0] ){
                solved_corners[i] = true;
                if ( i != 0 ){
                    cw_corners.push(corner_cubies[i][0]);
                }
            }
            // Corner is in correct position but needs to be rotated counter-clockwise
            else if ( corners[corner_cubies[i][0]] == corner_cubies[i][2] && corners[corner_cubies[i][1]] == corner_cubies[i][0] && corners[corner_cubies[i][2]] == corner_cubies[i][1] ){
                solved_corners[i] = true;
                if ( i != 0 ){
                    ccw_corners.push(corner_cubies[i][0]);
                }
            }
            else {
                // Found at least one unsolved corner
                solved_corners[i] = false;
                corners_solved = false;
            }
        }
    }

    return corners_solved;
}

// Solves all 12 edges in the cube
function solveEdges(){
    edge_cycles = [];
    flipped_edges = [];

    // // Parity is solved by swapping UL and UB
    // if ( corner_cycles.length%2 == 1 ){
    //     var UB = -1;
    //     var UL = -1;

    //     // Positions of UB and UL edges are found
    //     for (var i=0; i<12 && (UB == -1 || UL == -1); i++){
    //         if ( (edges[edge_cubies[i][0]] == A && edges[edge_cubies[i][1]] == Q) || (edges[edge_cubies[i][1]] == A && edges[edge_cubies[i][0]] == Q) ){
    //             UB = i;
    //         }
    //         if ( (edges[edge_cubies[i][0]] == D && edges[edge_cubies[i][1]] == E) || (edges[edge_cubies[i][1]] == D && edges[edge_cubies[i][0]] == E) ){
    //             UL = i;
    //         }
    //     }

    //     // UB is stored in buffer
    //     var temp_edge = [edges[edge_cubies[UB][0]],edges[edge_cubies[UB][1]]];

    //     // Make sure that A goes to D and Q goes to E
    //     var index = 0;
    //     if ( (edges[edge_cubies[UB][0]] == A && edges[edge_cubies[UL][0]] == E) || (edges[edge_cubies[UB][0]] == Q && edges[edge_cubies[UL][0]] == D) ){
    //         index = 1;
    //     }

    //     // UL is placed in UB
    //     edges[edge_cubies[UB][0]] = edges[edge_cubies[UL][index]];
    //     edges[edge_cubies[UB][1]] = edges[edge_cubies[UL][(index+1)%2]];

    //     // buffer is placed in UL
    //     edges[edge_cubies[UL][0]] = temp_edge[index];
    //     edges[edge_cubies[UL][1]] = temp_edge[(index+1)%2];
    // }

    while ( !edgesSolved() ){
        cycleEdgeBuffer();
    }
}

// Replaces the edge buffer with another edge
function cycleEdgeBuffer(){
    var edge_cycled = false;

    // If the buffer is solved, replace it with an unsolved edge
    if ( solved_edges[0] ){
        // First unsolved edge is selected
        for (var i=1; i<12 && !edge_cycled; i++){
            if ( !solved_edges[i] ){
                // Buffer is placed in a... um... buffer
                var temp_edge = [edges[edge_cubies[0][0]], edges[edge_cubies[0][1]]];

                // Buffer edge is replaced with edge
                edges[edge_cubies[0][0]] = edges[edge_cubies[i][0]];
                edges[edge_cubies[0][1]] = edges[edge_cubies[i][1]];

                // Edge is replaced with buffer
                edges[edge_cubies[i][0]] = temp_edge[0];
                edges[edge_cubies[i][1]] = temp_edge[1];

                // Edge cycle is inserted into solution array
                edge_cycles.push( edge_cubies[i][0] );
                edge_cycled = true;
            }
        }
    }
    // If the buffer is not solved, swap it to the position where the edge belongs
    else {
        for (var i=0; i<12 && !edge_cycled; i++){
            for (var j=0; j<2 && !edge_cycled; j++){
                if ( edges[edge_cubies[0][0]] == edge_cubies[i][j%2] && edges[edge_cubies[0][1]] == edge_cubies[i][(j+1)%2] ){
                    // Buffer edge is replaced with edge
                    edges[edge_cubies[0][0]] = edges[edge_cubies[i][j%2]];
                    edges[edge_cubies[0][1]] = edges[edge_cubies[i][(j+1)%2]];

                    // Edge is solved
                    edges[edge_cubies[i][0]] = edge_cubies[i][0];
                    edges[edge_cubies[i][1]] = edge_cubies[i][1];

                    // Edge cycle is inserted into solution array
                    edge_cycles.push( edge_cubies[i][j%2] );
                    edge_cycled = true;
                }
            }
        }
    }
}

// Checks if all 12 edges are already solved
// Ignores orientation
function edgesSolved (){
    var edges_solved = true;

    // Check if corners marked as unsolved haven't been solved yet
    for (var i=0; i<12; i++){
        if ( i==0 || !solved_edges[i] ){
            // Edge is solved in correct orientation
            if ( edges[edge_cubies[i][0]] == edge_cubies[i][0] && edges[edge_cubies[i][1]] == edge_cubies[i][1] ) {
                solved_edges[i] = true;
            }
            // Edge is solved but miss-oriented
            else if ( edges[edge_cubies[i][0]] == edge_cubies[i][1] && edges[edge_cubies[i][1]] == edge_cubies[i][0] ){
                solved_edges[i] = true;
                if (i != 0){
                    flipped_edges.push(edge_cubies[i][0]);
                }
            }
            else {
                // Found at least one unsolved edge
                solved_edges[i] = false;
                edges_solved = false;
            }
        }
    }

    return edges_solved;
}

function getCornerCycleSequence() {
    let array = [];
    for (let i = 0; i < corner_cycles.length; i++) {
        array.push(intToLetter[corner_cycles[i]]);
    }

    // ccw corners
    let ccw_dictionary = [
        [[A, R], [R, E], [E, A]],
        [[B, N], [N, Q], [Q, B]],
        [[C, J], [J, M], [M, C]],
        [[D, F], [F, I], [I, D]],
        [[E, A], [A, R], [R, E]],
        [[F, I], [I, D], [D, F]],
        [[G, U], [U, L], [L, G]],
        [[H, S], [S, X], [X, H]],
        [[I, D], [D, F], [F, I]],
        [[J, M], [M, C], [C, J]],
        [[K, V], [V, P], [P, K]],
        [[L, G], [G, U], [U, L]],
        [[M, C], [C, J], [J, M]],
        [[N, Q], [Q, B], [B, N]],
        [[O, W], [W, T], [T, O]],
        [[P, K], [K, V], [V, P]],
        [[Q, B], [B, N], [N, Q]],
        [[R, E], [E, A], [A, R]],
        [[S, X], [X, H], [H, S]],
        [[T, O], [O, W], [W, T]],
        [[U, L], [L, G], [G, U]],
        [[V, P], [P, K], [K, V]],
        [[W, T], [T, O], [O, W]],
        [[X, H], [H, S], [S, X]]
    ];

    // cw corners
    let cw_dictionary = [
        [[A, E], [E, R], [R, A]],
        [[B, Q], [Q, N], [N, B]],
        [[C, M], [M, J], [J, C]],
        [[D, I], [I, F], [F, D]],
        [[E, R], [R, A], [A, E]],
        [[F, D], [D, I], [I, F]],
        [[G, L], [L, U], [U, G]],
        [[H, X], [X, S], [S, H]],
        [[I, F], [F, D], [D, I]],
        [[J, C], [C, M], [M, J]],
        [[K, P], [P, V], [V, K]],
        [[L, U], [U, G], [G, L]],
        [[M, J], [J, C], [C, M]],
        [[N, B], [B, Q], [Q, N]],
        [[O, T], [T, W], [W, O]],
        [[P, V], [V, K], [K, P]],
        [[Q, N], [N, B], [B, Q]],
        [[R, A], [A, E], [E, R]],
        [[S, H], [H, X], [X, S]],
        [[T, W], [W, O], [O, T]],
        [[U, G], [G, L], [L, U]],
        [[V, K], [K, P], [P, V]],
        [[W, O], [O, T], [T, W]],
        [[X, S], [S, H], [H, X]]
    ];

    for (let i = 0; i < ccw_corners.length; i++) {
        let index = Math.floor(Math.random() * 3);
        let letter1 = ccw_dictionary[ccw_corners[i]][index][0];
        let letter2 = ccw_dictionary[ccw_corners[i]][index][1];
        array.push(intToLetter[letter1]);
        array.push(intToLetter[letter2]);
    }

    for (let i = 0; i < cw_corners.length; i++) {
        let index = Math.floor(Math.random() * 3);
        let letter1 = cw_dictionary[cw_corners[i]][index][0];
        let letter2 = cw_dictionary[cw_corners[i]][index][1];
        array.push(intToLetter[letter1]);
        array.push(intToLetter[letter2]);
    }

    // console.log(array.join(" "));
    array.push('/');
    return array;
}

function getEdgeCycleSequence() {
    let array = [];
    for (let i = 0; i < edge_cycles.length; i++) {
        array.push(intToLetter[edge_cycles[i]]);
    }

    // flipped edges
    let dictionary = [
        ['A', 'Q'], ['Q', 'A'], 
        ['B', 'M'], ['M', 'B'], 
        ['C', 'I'], ['I', 'C'], 
        ['D', 'E'], ['E', 'D'], 
        ['F', 'L'], ['L', 'F'], 
        ['G', 'X'], ['X', 'G'], 
        ['H', 'R'], ['R', 'H'], 
        ['J', 'P'], ['P', 'J'], 
        ['K', 'U'], ['U', 'K'], 
        ['N', 'T'], ['T', 'N'], 
        ['O', 'V'], ['V', 'O'], 
        ['S', 'W'], ['W', 'S']
    ];

    dictionary.sort((cap1, cap2) => cap1[0].localeCompare(cap2[0]));

    for (let i = 0; i < flipped_edges.length; i++) {
        let index = Math.floor(Math.random() * 2);
        let letter1 = dictionary[flipped_edges[i]][0];
        let letter2 = dictionary[flipped_edges[i]][1];
        array.push(letter1);
        array.push(letter2);
    }

    // console.log(array.join(" "));
    array.push('/');
    return array;
}