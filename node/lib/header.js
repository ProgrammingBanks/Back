"use strict";
const msgType = {
    cltAcc01Req: 0,
    cltAcc01Res: 1,
    cltAcc02Req: 2,
    cltAcc02Res: 3,
    cltAcc03Req: 4,
    cltAcc03Res: 5,
    cltAcc04Req: 6,
    cltAcc04Res: 7,
    cltAcc05Req: 8,
    cltAcc05Res: 9,
    cltFarm01Req: 10,
    cltFarm01Res: 11,
    cltFarm02Req: 12,
    cltFarm02Res: 13,
    cltFarm03Req: 14,
    cltFarm03Res: 15
};
const resCode = {   
   cltAcc01: {
    OK: 0,
    unknownErr: 1,
    existEmail: 2
   },
   cltAcc02: {
    OK: 0,
    unknownErr: 1,
    noUserData: 2,
    wrongPw: 3
   },
   cltAcc03: {
    OK: 0,
    unknownErr: 1,
    noUserData: 2,
    unvaildReq: 3
   },
   cltAcc04: {
    OK: 0,
    unknownErr: 1,
    noUserData: 2,
    unvaildReq: 3
   },
   cltAcc05: {
    OK: 0,
    unknownErr: 1,
    noUserData: 2,
    unvaildReq: 3,
    wrongPw: 4,
    dupEmail: 5
   },
   cltfarm05: {
    OK: 0,
    unknownErr: 1,
    noUserData: 2,
    unvaildReq: 3
   }
};

module.exports = {
    resCode, 
    msgType
};