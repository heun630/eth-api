module.exports = Object.freeze({
    RET_SUCCESS:                    { code: 0,      msg: 'OK' },

    RET_SYSTEM_CRITICAL:            { code: 10,     msg: '심각한 에러' },
    RET_SYSTEM_FAIL_ACTION:         { code: 11,     msg: '동작 실패' },
    RET_SYSTEM_NOT_ALLOW_CONNECT:   { code: 12,     msg: 'Not Allow Connection' },
    RET_SYSTEM_UPDATE:              { code: 13,     msg: '새로운 버전으로 업데이트 하셔야 적립을 받으실 수 있습니다' },
    RET_SYSTEM_MAINTENANCE:         { code: 14,     msg: '서버 점검중 입니다' },

    RET_DB_CONN_ERR:                { code: 100,    msg: 'db 연결 에러' },
    RET_DB_CLOSED:                  { code: 101,    msg: 'db 연결 닫힘' },
    RET_DB_QUERY_ERR:               { code: 102,    msg: 'db query 에러' },

    RET_PARM_INVALID_TYPE:          { code: 300,    msg: 'Invalid Type' },
    RET_PARM_EMPTY:                 { code: 301,    msg: 'parameter is empty' },
    RET_PARM_INVALID_LEN:           { code: 302,    msg: 'parameter length invalid' },

    RET_CRYPT_KEY_NULL:             { code: 400,    msg: 'decrypt key is null' },
    RET_CRYPT_DATA_NULL:            { code: 401,    msg: 'decrypt data is null' },
    RET_CRYPT_HASH_LEN_NOT_EQUAL:   { code: 402,    msg: 'hash length not equal' },
    RET_CRYPT_HASH_NOT_EQUAL:       { code: 403,    msg: 'key valid time is expired' },
    RET_CRYPT_KEY_EXPIRED:          { code: 404,    msg: 'key valid time is expired' },

    RET_TOKEN_EXPIRED:              { code: 500,    msg: 'access token expired' },
    RET_TOKEN_NOT_VALID:            { code: 501,    msg: 'access token is not valid' },

    RET_APP_NO_EXIST_MEDIA:         { code: 600,    msg: 'No exist media' },

    RET_WEB3_RESPONSE_ERROR :       { code: 701,    msg: 'web3 error' },
});
