import { default as default1 } from './snippets/basis-universal-wasm-8dd816e8505190b7/basis_universal/webgl/transcoder/build/basis_transcoder.js';
import { startWorker } from './snippets/wasm-futures-executor-7283b277ab0e797e/worker.js';

let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().slice(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const CLOSURE_DTORS = new FinalizationRegistry(state => {
    wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state)
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_32(arg0, arg1, arg2, arg3) {
    wasm._dyn_core__ops__function__FnMut__A_B___Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hf5a38454f67aea1f(arg0, arg1, arg2, addHeapObject(arg3));
}

function __wbg_adapter_35(arg0, arg1, arg2, arg3) {
    const ptr0 = passStringToWasm0(arg3, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm._dyn_core__ops__function__FnMut__A_B___Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h46757d2b9ace731a(arg0, arg1, addHeapObject(arg2), ptr0, len0);
}

function __wbg_adapter_38(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h43f0d55423393da2(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_41(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h43f0d55423393da2(arg0, arg1, addHeapObject(arg2));
}

/**
*/
export function main() {
    wasm.main();
}

/**
* @returns {Promise<void>}
*/
export function run() {
    const ret = wasm.run();
    return takeObject(ret);
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getObject(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}
/**
* Entry point invoked by the web worker. The passed pointer will be unconditionally interpreted
* as an `Arc<PoolState>`.
* @param {number} state_ptr
*/
export function worker_entry_point(state_ptr) {
    wasm.worker_entry_point(state_ptr);
}

let cachegetFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachegetFloat32Memory0 === null || cachegetFloat32Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayI32FromWasm0(ptr, len) {
    return getInt32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayU32FromWasm0(ptr, len) {
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getFloat32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
function __wbg_adapter_684(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__hdac72e088abdf884(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

const LoaderHelperFinalization = new FinalizationRegistry(ptr => wasm.__wbg_loaderhelper_free(ptr));
/**
*/
export class LoaderHelper {

    static __wrap(ptr) {
        const obj = Object.create(LoaderHelper.prototype);
        obj.ptr = ptr;
        LoaderHelperFinalization.register(obj, obj.ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        LoaderHelperFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_loaderhelper_free(ptr);
    }
    /**
    * @returns {string}
    */
    mainJS() {
        const ret = wasm.loaderhelper_mainJS(this.ptr);
        return takeObject(ret);
    }
}

const ThreadPoolFinalization = new FinalizationRegistry(ptr => wasm.__wbg_threadpool_free(ptr));
/**
* A general-purpose thread pool for scheduling tasks that poll futures to
* completion.
*
* The thread pool multiplexes any number of tasks onto a fixed number of
* worker threads.
*
* This type is a clonable handle to the threadpool itself.
* Cloning it will only create a new reference, not a new threadpool.
*
* The API follows [`futures_executor::ThreadPool`].
*
* [`futures_executor::ThreadPool`]: https://docs.rs/futures-executor/0.3.16/futures_executor/struct.ThreadPool.html
*/
export class ThreadPool {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        ThreadPoolFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_threadpool_free(ptr);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input, maybe_memory) {
    if (typeof input === 'undefined') {
        input = new URL('mateversum_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_default_e5673be54c8cef07 = function(arg0) {
        const ret = default1(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1); }
    console.error(v0);
};
imports.wbg.__wbg_static_accessor_URL_197fe51300c39f76 = function() {
    const ret = import.meta.url;
    return addHeapObject(ret);
};
imports.wbg.__wbg_startWorker_bccbf4e21200b8b6 = function(arg0, arg1, arg2, arg3, arg4) {
    const ret = startWorker(takeObject(arg0), takeObject(arg1), takeObject(arg2), takeObject(arg3), LoaderHelper.__wrap(arg4));
    return addHeapObject(ret);
};
imports.wbg.__wbg_static_accessor_HARDWARE_CONCURRENCY_debf3cb7fee810b5 = function() {
    const ret = navigator.hardwareConcurrency;
    return ret;
};
imports.wbg.__wbg_initializeBasis_d36900ac380f3909 = function(arg0) {
    getObject(arg0).initializeBasis();
};
imports.wbg.__wbg_BasisFile_9b6882f99af2ef90 = function(arg0) {
    const ret = getObject(arg0).BasisFile;
    return addHeapObject(ret);
};
imports.wbg.__wbg_transcodeUASTCSlice_972876fbab24cdd5 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15) {
    const ret = getObject(arg0).transcodeUASTCSlice(getObject(arg1), arg2 >>> 0, arg3 >>> 0, getObject(arg4), arg5, arg6 >>> 0, arg7 !== 0, arg8 !== 0, arg9 >>> 0, arg10 >>> 0, arg11 >>> 0, arg12 >>> 0, arg13, arg14, arg15 >>> 0);
    return ret;
};
imports.wbg.__wbg_getNumLevels_40febd0d136a6955 = function(arg0, arg1) {
    const ret = getObject(arg0).getNumLevels(arg1 >>> 0);
    return ret;
};
imports.wbg.__wbg_startTranscoding_37e8ae337fc42f3c = function(arg0) {
    const ret = getObject(arg0).startTranscoding();
    return ret;
};
imports.wbg.__wbg_getImageWidth_68c77cea9cd3a63d = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getImageWidth(arg1 >>> 0, arg2 >>> 0);
    return ret;
};
imports.wbg.__wbg_getImageHeight_72f09cf5d7543440 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getImageHeight(arg1 >>> 0, arg2 >>> 0);
    return ret;
};
imports.wbg.__wbg_getImageTranscodedSizeInBytes_d2a746dc0b3ff8cc = function(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).getImageTranscodedSizeInBytes(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
    return ret;
};
imports.wbg.__wbg_transcodeImage_f9fd4bfce526df2d = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const ret = getObject(arg0).transcodeImage(getObject(arg1), arg2 >>> 0, arg3 >>> 0, arg4 >>> 0, arg5 >>> 0, arg6 >>> 0);
    return ret;
};
imports.wbg.__wbg_close_2b86c592198963a7 = function(arg0) {
    getObject(arg0).close();
};
imports.wbg.__wbg_delete_ff75b60a865d0c6f = function(arg0) {
    getObject(arg0).delete();
};
imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};
imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};
imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_waitAsync_5907fae24f9aa09a = function() {
    const ret = Atomics.waitAsync;
    return addHeapObject(ret);
};
imports.wbg.__wbg_waitAsync_67c84a1c78e5fa4e = function(arg0, arg1, arg2) {
    const ret = Atomics.waitAsync(getObject(arg0), arg1, arg2);
    return addHeapObject(ret);
};
imports.wbg.__wbg_async_b3aed9fce0e0b073 = function(arg0) {
    const ret = getObject(arg0).async;
    return ret;
};
imports.wbg.__wbg_value_14baa9a2802e5311 = function(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
};
imports.wbg.__wbg_instanceof_WebGl2RenderingContext_e29e70ae6c00bfdd = function(arg0) {
    const ret = getObject(arg0) instanceof WebGL2RenderingContext;
    return ret;
};
imports.wbg.__wbg_beginQuery_d9e264077a066b1b = function(arg0, arg1, arg2) {
    getObject(arg0).beginQuery(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_bindBufferRange_33bd5ffaaa40a5a6 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).bindBufferRange(arg1 >>> 0, arg2 >>> 0, getObject(arg3), arg4, arg5);
};
imports.wbg.__wbg_bindSampler_1d02b72cdccb98c7 = function(arg0, arg1, arg2) {
    getObject(arg0).bindSampler(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_bindVertexArray_dfe63bf55a9f6e54 = function(arg0, arg1) {
    getObject(arg0).bindVertexArray(getObject(arg1));
};
imports.wbg.__wbg_blitFramebuffer_c72c74d695ed2ece = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    getObject(arg0).blitFramebuffer(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0);
};
imports.wbg.__wbg_bufferData_c58bce6c13d73e02 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
};
imports.wbg.__wbg_bufferData_8542921547008e80 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
};
imports.wbg.__wbg_bufferSubData_17fd7936ab128c56 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferSubData(arg1 >>> 0, arg2, getObject(arg3));
};
imports.wbg.__wbg_clearBufferfv_23a50f05d21aad3f = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).clearBufferfv(arg1 >>> 0, arg2, getArrayF32FromWasm0(arg3, arg4));
};
imports.wbg.__wbg_clearBufferiv_adb545a1edf7013a = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).clearBufferiv(arg1 >>> 0, arg2, getArrayI32FromWasm0(arg3, arg4));
};
imports.wbg.__wbg_clearBufferuiv_a985a4810f2aff85 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).clearBufferuiv(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4));
};
imports.wbg.__wbg_clientWaitSync_8f7564d8e69854e9 = function(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).clientWaitSync(getObject(arg1), arg2 >>> 0, arg3 >>> 0);
    return ret;
};
imports.wbg.__wbg_compressedTexSubImage2D_8b5da3cce00e853e = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8, arg9);
};
imports.wbg.__wbg_compressedTexSubImage2D_d1972164abc1dca7 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    getObject(arg0).compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, getObject(arg8));
};
imports.wbg.__wbg_compressedTexSubImage3D_5e3aabc00a092ae8 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10, arg11);
};
imports.wbg.__wbg_compressedTexSubImage3D_24b4925c4cc6adc1 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    getObject(arg0).compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, getObject(arg10));
};
imports.wbg.__wbg_copyBufferSubData_2653f860bc9de094 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).copyBufferSubData(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
};
imports.wbg.__wbg_copyTexSubImage3D_6c831053759fac49 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).copyTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
};
imports.wbg.__wbg_createSampler_b7c38920b1aa08d9 = function(arg0) {
    const ret = getObject(arg0).createSampler();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createVertexArray_d502151c473563b2 = function(arg0) {
    const ret = getObject(arg0).createVertexArray();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_deleteQuery_00d24ac94f0a6395 = function(arg0, arg1) {
    getObject(arg0).deleteQuery(getObject(arg1));
};
imports.wbg.__wbg_deleteSampler_d59837527a84a3a6 = function(arg0, arg1) {
    getObject(arg0).deleteSampler(getObject(arg1));
};
imports.wbg.__wbg_deleteSync_7d1bce835110ac1f = function(arg0, arg1) {
    getObject(arg0).deleteSync(getObject(arg1));
};
imports.wbg.__wbg_deleteVertexArray_3a1bab38b8ce3a22 = function(arg0, arg1) {
    getObject(arg0).deleteVertexArray(getObject(arg1));
};
imports.wbg.__wbg_drawArraysInstanced_921be0942a90b777 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).drawArraysInstanced(arg1 >>> 0, arg2, arg3, arg4);
};
imports.wbg.__wbg_drawBuffers_30164d7c5fd10016 = function(arg0, arg1) {
    getObject(arg0).drawBuffers(getObject(arg1));
};
imports.wbg.__wbg_drawElementsInstanced_ea6a96176b3a8110 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};
imports.wbg.__wbg_endQuery_7cb1091b756435f7 = function(arg0, arg1) {
    getObject(arg0).endQuery(arg1 >>> 0);
};
imports.wbg.__wbg_fenceSync_a30c756c7278420a = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).fenceSync(arg1 >>> 0, arg2 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_framebufferTextureLayer_5ead383facc27b85 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).framebufferTextureLayer(arg1 >>> 0, arg2 >>> 0, getObject(arg3), arg4, arg5);
};
imports.wbg.__wbg_getBufferSubData_c211a29de38ee925 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).getBufferSubData(arg1 >>> 0, arg2, getObject(arg3));
};
imports.wbg.__wbg_getIndexedParameter_9be4debbfa0e98d5 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).getIndexedParameter(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getQueryParameter_071fddc760c1aeb1 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getQueryParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_getSyncParameter_6c98bbe717c4f18c = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getSyncParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_getUniformBlockIndex_7c83171070647d86 = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg0).getUniformBlockIndex(getObject(arg1), v0);
    return ret;
};
imports.wbg.__wbg_invalidateFramebuffer_459149f09712550c = function() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).invalidateFramebuffer(arg1 >>> 0, getObject(arg2));
}, arguments) };
imports.wbg.__wbg_readBuffer_3dcad92784060e4c = function(arg0, arg1) {
    getObject(arg0).readBuffer(arg1 >>> 0);
};
imports.wbg.__wbg_readPixels_a357dbdb4f70e4c4 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    getObject(arg0).readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, getObject(arg7));
}, arguments) };
imports.wbg.__wbg_readPixels_804016440beb4685 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    getObject(arg0).readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
}, arguments) };
imports.wbg.__wbg_renderbufferStorageMultisample_90aa1df2657b1a0a = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).renderbufferStorageMultisample(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};
imports.wbg.__wbg_samplerParameterf_d09c5bed12b99776 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).samplerParameterf(getObject(arg1), arg2 >>> 0, arg3);
};
imports.wbg.__wbg_samplerParameteri_ad7e20195ba3a068 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).samplerParameteri(getObject(arg1), arg2 >>> 0, arg3);
};
imports.wbg.__wbg_texStorage2D_a1b9c11e4f891c77 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).texStorage2D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};
imports.wbg.__wbg_texStorage3D_7c060bf5edbc4d83 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).texStorage3D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5, arg6);
};
imports.wbg.__wbg_texSubImage2D_f5b8e6e635a5736f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };
imports.wbg.__wbg_texSubImage2D_b26e671fcb768c49 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };
imports.wbg.__wbg_texSubImage3D_e15f4453401a5cb0 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };
imports.wbg.__wbg_texSubImage3D_b80fffc939b7d64a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, getObject(arg11));
}, arguments) };
imports.wbg.__wbg_uniform2fv_2b959fd934e53b8e = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform2iv_6dc30aad407968d4 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform3fv_2cf35265ef39e6c3 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform3fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform3iv_bec2b5d8385bfda4 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform3iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform4fv_0af85ef96cb6117e = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform4fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform4iv_7608fe2c1ba63eb4 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform4iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniformBlockBinding_c0156a47ae6bf012 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniformBlockBinding(getObject(arg1), arg2 >>> 0, arg3 >>> 0);
};
imports.wbg.__wbg_uniformMatrix2fv_c6c25fe4f23a5046 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix2fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};
imports.wbg.__wbg_uniformMatrix3fv_e9ac456550ed8239 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix3fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};
imports.wbg.__wbg_uniformMatrix4fv_aebec0f9fc8d816b = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix4fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};
imports.wbg.__wbg_vertexAttribDivisor_6cc6abefe1438a03 = function(arg0, arg1, arg2) {
    getObject(arg0).vertexAttribDivisor(arg1 >>> 0, arg2 >>> 0);
};
imports.wbg.__wbg_vertexAttribIPointer_e54393825ecebdf4 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).vertexAttribIPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};
imports.wbg.__wbg_activeTexture_eec8b0e6c72c6814 = function(arg0, arg1) {
    getObject(arg0).activeTexture(arg1 >>> 0);
};
imports.wbg.__wbg_attachShader_0994bf956cb31b2b = function(arg0, arg1, arg2) {
    getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
};
imports.wbg.__wbg_bindBuffer_a5f37e5ebd81a1f6 = function(arg0, arg1, arg2) {
    getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_bindFramebuffer_6ef149f7d398d19f = function(arg0, arg1, arg2) {
    getObject(arg0).bindFramebuffer(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_bindRenderbuffer_1974e9f4fdd0b3af = function(arg0, arg1, arg2) {
    getObject(arg0).bindRenderbuffer(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_bindTexture_dbddb0b0c3efa1b9 = function(arg0, arg1, arg2) {
    getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_blendColor_0f4aa917df7d4cb5 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).blendColor(arg1, arg2, arg3, arg4);
};
imports.wbg.__wbg_blendEquation_056ed0bd7ea9fa27 = function(arg0, arg1) {
    getObject(arg0).blendEquation(arg1 >>> 0);
};
imports.wbg.__wbg_blendEquationSeparate_ccdda0657b246bb0 = function(arg0, arg1, arg2) {
    getObject(arg0).blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
};
imports.wbg.__wbg_blendFunc_72335b5494b68bc1 = function(arg0, arg1, arg2) {
    getObject(arg0).blendFunc(arg1 >>> 0, arg2 >>> 0);
};
imports.wbg.__wbg_blendFuncSeparate_0aa8a7b4669fb810 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};
imports.wbg.__wbg_colorMask_c92354ec3511685f = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
};
imports.wbg.__wbg_compileShader_4940032085b41ed2 = function(arg0, arg1) {
    getObject(arg0).compileShader(getObject(arg1));
};
imports.wbg.__wbg_copyTexSubImage2D_973985fdadd2db42 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    getObject(arg0).copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
};
imports.wbg.__wbg_createBuffer_b6dbd62c544371ed = function(arg0) {
    const ret = getObject(arg0).createBuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createFramebuffer_f656a97f24d2caf3 = function(arg0) {
    const ret = getObject(arg0).createFramebuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createProgram_6a25e4bb5cfaad4b = function(arg0) {
    const ret = getObject(arg0).createProgram();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createRenderbuffer_e66ea157342e02e9 = function(arg0) {
    const ret = getObject(arg0).createRenderbuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createShader_c17c7cf4768e0737 = function(arg0, arg1) {
    const ret = getObject(arg0).createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createTexture_0df375980a9c46c9 = function(arg0) {
    const ret = getObject(arg0).createTexture();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_cullFace_6f523218f401ecbb = function(arg0, arg1) {
    getObject(arg0).cullFace(arg1 >>> 0);
};
imports.wbg.__wbg_deleteBuffer_c39be892f7833f5b = function(arg0, arg1) {
    getObject(arg0).deleteBuffer(getObject(arg1));
};
imports.wbg.__wbg_deleteFramebuffer_609d82d380c88142 = function(arg0, arg1) {
    getObject(arg0).deleteFramebuffer(getObject(arg1));
};
imports.wbg.__wbg_deleteProgram_acd3f81d082ffd17 = function(arg0, arg1) {
    getObject(arg0).deleteProgram(getObject(arg1));
};
imports.wbg.__wbg_deleteRenderbuffer_d12ade31b823658c = function(arg0, arg1) {
    getObject(arg0).deleteRenderbuffer(getObject(arg1));
};
imports.wbg.__wbg_deleteShader_b6480fae6d31ca67 = function(arg0, arg1) {
    getObject(arg0).deleteShader(getObject(arg1));
};
imports.wbg.__wbg_deleteTexture_8c7434cb1b20f64f = function(arg0, arg1) {
    getObject(arg0).deleteTexture(getObject(arg1));
};
imports.wbg.__wbg_depthFunc_86631c06d99cc8b7 = function(arg0, arg1) {
    getObject(arg0).depthFunc(arg1 >>> 0);
};
imports.wbg.__wbg_depthMask_2e8f4eeb8622dd9a = function(arg0, arg1) {
    getObject(arg0).depthMask(arg1 !== 0);
};
imports.wbg.__wbg_depthRange_fcefa24285a5ccf3 = function(arg0, arg1, arg2) {
    getObject(arg0).depthRange(arg1, arg2);
};
imports.wbg.__wbg_disable_ec8402e41edbe277 = function(arg0, arg1) {
    getObject(arg0).disable(arg1 >>> 0);
};
imports.wbg.__wbg_disableVertexAttribArray_8da45bfa7fa5a02d = function(arg0, arg1) {
    getObject(arg0).disableVertexAttribArray(arg1 >>> 0);
};
imports.wbg.__wbg_drawArrays_ab8fc431291e5dff = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
};
imports.wbg.__wbg_drawElements_a192faf49b4975d6 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
};
imports.wbg.__wbg_enable_51cc5ea7d16e475c = function(arg0, arg1) {
    getObject(arg0).enable(arg1 >>> 0);
};
imports.wbg.__wbg_enableVertexAttribArray_85c507778523db86 = function(arg0, arg1) {
    getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
};
imports.wbg.__wbg_framebufferRenderbuffer_d73f3cb3e5a605a2 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4));
};
imports.wbg.__wbg_framebufferTexture2D_e07b69d4972eccfd = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4), arg5);
};
imports.wbg.__wbg_frontFace_89e3ad9de5432f0d = function(arg0, arg1) {
    getObject(arg0).frontFace(arg1 >>> 0);
};
imports.wbg.__wbg_getActiveUniform_ee2d7b9e5794b43d = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getActiveUniform(getObject(arg1), arg2 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_getExtension_22c72750813222f6 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).getExtension(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getParameter_00a3d89e6e005c2f = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).getParameter(arg1 >>> 0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getProgramInfoLog_234b1b9dbbc9282f = function(arg0, arg1, arg2) {
    const ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_getProgramParameter_4100b1077a68e2ec = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_getShaderInfoLog_a680dbc6e8440e5b = function(arg0, arg1, arg2) {
    const ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_getShaderParameter_87e97ffc5dc7fb05 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_getSupportedExtensions_f7eec3b83ce8c78d = function(arg0) {
    const ret = getObject(arg0).getSupportedExtensions();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_getUniformLocation_201fd94276e7dc6f = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg0).getUniformLocation(getObject(arg1), v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_linkProgram_edd275997033948d = function(arg0, arg1) {
    getObject(arg0).linkProgram(getObject(arg1));
};
imports.wbg.__wbg_pixelStorei_db7d39661916037c = function(arg0, arg1, arg2) {
    getObject(arg0).pixelStorei(arg1 >>> 0, arg2);
};
imports.wbg.__wbg_polygonOffset_db4c417637942873 = function(arg0, arg1, arg2) {
    getObject(arg0).polygonOffset(arg1, arg2);
};
imports.wbg.__wbg_renderbufferStorage_6ded6b343c662a60 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
};
imports.wbg.__wbg_scissor_3ea2048f24928f06 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).scissor(arg1, arg2, arg3, arg4);
};
imports.wbg.__wbg_shaderSource_bbfeb057b5f88df5 = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    getObject(arg0).shaderSource(getObject(arg1), v0);
};
imports.wbg.__wbg_stencilFuncSeparate_f43489c7ac77594b = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
};
imports.wbg.__wbg_stencilMask_fea8ee1f2c935ebb = function(arg0, arg1) {
    getObject(arg0).stencilMask(arg1 >>> 0);
};
imports.wbg.__wbg_stencilMaskSeparate_d0d09f427805178d = function(arg0, arg1, arg2) {
    getObject(arg0).stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
};
imports.wbg.__wbg_stencilOpSeparate_c2d74b39ae1dc753 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};
imports.wbg.__wbg_texParameteri_7414cf15f83e1d52 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};
imports.wbg.__wbg_uniform1f_96f460c33192c593 = function(arg0, arg1, arg2) {
    getObject(arg0).uniform1f(getObject(arg1), arg2);
};
imports.wbg.__wbg_uniform1i_22f9e77ed65e1503 = function(arg0, arg1, arg2) {
    getObject(arg0).uniform1i(getObject(arg1), arg2);
};
imports.wbg.__wbg_uniform4f_5381c7867ad1318a = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).uniform4f(getObject(arg1), arg2, arg3, arg4, arg5);
};
imports.wbg.__wbg_useProgram_039f85866d3a975b = function(arg0, arg1) {
    getObject(arg0).useProgram(getObject(arg1));
};
imports.wbg.__wbg_vertexAttribPointer_4375ff065dcf90ed = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
};
imports.wbg.__wbg_viewport_06c29be651af660a = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).viewport(arg1, arg2, arg3, arg4);
};
imports.wbg.__wbg_instanceof_Window_0e6c0f1096d66c3c = function(arg0) {
    const ret = getObject(arg0) instanceof Window;
    return ret;
};
imports.wbg.__wbg_document_99eddbbc11ec831e = function(arg0) {
    const ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_location_fa9019d2eb2195e8 = function(arg0) {
    const ret = getObject(arg0).location;
    return addHeapObject(ret);
};
imports.wbg.__wbg_navigator_1f72d7edb7b4c387 = function(arg0) {
    const ret = getObject(arg0).navigator;
    return addHeapObject(ret);
};
imports.wbg.__wbg_caches_3efbf43695d369e8 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).caches;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_fetch_ef7a6623d1fcd3b8 = function(arg0, arg1) {
    const ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_session_35c865c4d3689e68 = function(arg0) {
    const ret = getObject(arg0).session;
    return addHeapObject(ret);
};
imports.wbg.__wbg_getPose_51d8fe673d377e23 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getPose(getObject(arg1), getObject(arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_getViewerPose_f6a2201e0950d37a = function(arg0, arg1) {
    const ret = getObject(arg0).getViewerPose(getObject(arg1));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_gripSpace_b5524db0375b6a38 = function(arg0) {
    const ret = getObject(arg0).gripSpace;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_projectionMatrix_d9fe4089df4c98b5 = function(arg0, arg1) {
    const ret = getObject(arg1).projectionMatrix;
    const ptr0 = passArrayF32ToWasm0(ret, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_transform_c82e9bf8444a51d2 = function(arg0) {
    const ret = getObject(arg0).transform;
    return addHeapObject(ret);
};
imports.wbg.__wbg_views_0d7ac5a9e6bbaa32 = function(arg0) {
    const ret = getObject(arg0).views;
    return addHeapObject(ret);
};
imports.wbg.__wbg_debug_fda1f49ea6af7a1d = function(arg0) {
    console.debug(getObject(arg0));
};
imports.wbg.__wbg_error_8ff19d586a987aef = function(arg0) {
    console.error(getObject(arg0));
};
imports.wbg.__wbg_info_c8f1b00be4ef10bc = function(arg0) {
    console.info(getObject(arg0));
};
imports.wbg.__wbg_log_e8ba7b992c7ad0eb = function(arg0) {
    console.log(getObject(arg0));
};
imports.wbg.__wbg_warn_0227db1aa6989248 = function(arg0) {
    console.warn(getObject(arg0));
};
imports.wbg.__wbg_setinnerText_44aedb3f4ca656d2 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).innerText = v0;
};
imports.wbg.__wbg_setonclick_12828f951f4f6a74 = function(arg0, arg1) {
    getObject(arg0).onclick = getObject(arg1);
};
imports.wbg.__wbg_name_672623b7f04c8c84 = function(arg0, arg1) {
    const ret = getObject(arg1).name;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_close_e5af9a7a702fb87a = function(arg0) {
    getObject(arg0).close();
};
imports.wbg.__wbg_newwithstrandinit_fd99688f189f053e = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Request(v0, getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_baseLayer_4f658ad4e8095b99 = function(arg0) {
    const ret = getObject(arg0).baseLayer;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_data_9ccfa9ae4eb71e78 = function(arg0) {
    const ret = getObject(arg0).data;
    return addHeapObject(ret);
};
imports.wbg.__wbg_transform_25f02832b1c1fe06 = function(arg0) {
    const ret = getObject(arg0).transform;
    return addHeapObject(ret);
};
imports.wbg.__wbg_x_6d3663342eccf266 = function(arg0) {
    const ret = getObject(arg0).x;
    return ret;
};
imports.wbg.__wbg_y_d4fdf338b3f4919a = function(arg0) {
    const ret = getObject(arg0).y;
    return ret;
};
imports.wbg.__wbg_width_e5e0f88a0e6a87f2 = function(arg0) {
    const ret = getObject(arg0).width;
    return ret;
};
imports.wbg.__wbg_height_58f7fd79b808a948 = function(arg0) {
    const ret = getObject(arg0).height;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlCanvasElement_b94545433bb4d2ef = function(arg0) {
    const ret = getObject(arg0) instanceof HTMLCanvasElement;
    return ret;
};
imports.wbg.__wbg_getContext_d7d734e1c1199dd1 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).getContext(v0, getObject(arg3));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_body_2a1ff14b05042a51 = function(arg0) {
    const ret = getObject(arg0).body;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createElement_3c9b5f3aa42457a1 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createElement(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_querySelector_c03126fc82664294 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).querySelector(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_drawArraysInstancedANGLE_42dbaa04eb6eafb5 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).drawArraysInstancedANGLE(arg1 >>> 0, arg2, arg3, arg4);
};
imports.wbg.__wbg_drawElementsInstancedANGLE_8ca6e0aee478b1d6 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).drawElementsInstancedANGLE(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};
imports.wbg.__wbg_vertexAttribDivisorANGLE_128d8966b30a77f8 = function(arg0, arg1, arg2) {
    getObject(arg0).vertexAttribDivisorANGLE(arg1 >>> 0, arg2 >>> 0);
};
imports.wbg.__wbg_match_0f08efee7f7cc0ba = function(arg0, arg1) {
    const ret = getObject(arg0).match(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_put_9cd62a1df06210bb = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).put(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_xr_5c8987541751310c = function(arg0) {
    const ret = getObject(arg0).xr;
    return addHeapObject(ret);
};
imports.wbg.__wbg_size_2821584638f68df1 = function(arg0) {
    const ret = getObject(arg0).size;
    return ret;
};
imports.wbg.__wbg_type_6b3d720c58da960e = function(arg0) {
    const ret = getObject(arg0).type;
    return ret;
};
imports.wbg.__wbg_name_b636d7dc5b7994a8 = function(arg0, arg1) {
    const ret = getObject(arg1).name;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_length_9f8e71f3542f702e = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_get_e9a0d3165c3e6185 = function(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_open_52c5eb54032958d7 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).open(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_appendChild_a86c0da8d152eae4 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).appendChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_framebuffer_6b00deff485b08b6 = function(arg0) {
    const ret = getObject(arg0).framebuffer;
    return addHeapObject(ret);
};
imports.wbg.__wbg_framebufferWidth_91c97789c2a95dab = function(arg0) {
    const ret = getObject(arg0).framebufferWidth;
    return ret;
};
imports.wbg.__wbg_framebufferHeight_eef5da30f1c69534 = function(arg0) {
    const ret = getObject(arg0).framebufferHeight;
    return ret;
};
imports.wbg.__wbg_newwithwebgl2renderingcontextandlayerinit_795fc196d8fce787 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = new XRWebGLLayer(getObject(arg0), getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getViewport_708032769fa45f54 = function(arg0, arg1) {
    const ret = getObject(arg0).getViewport(getObject(arg1));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_bufferData_7bdccbfbc1a4f5c5 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
};
imports.wbg.__wbg_bufferData_282e5d315f5503eb = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
};
imports.wbg.__wbg_bufferSubData_884f8fcf6ab0d69e = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferSubData(arg1 >>> 0, arg2, getObject(arg3));
};
imports.wbg.__wbg_compressedTexSubImage2D_29d0e2c56d65a454 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    getObject(arg0).compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, getObject(arg8));
};
imports.wbg.__wbg_readPixels_2bc3459a9d280818 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    getObject(arg0).readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, getObject(arg7));
}, arguments) };
imports.wbg.__wbg_texSubImage2D_fe76e590b3e3fa85 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };
imports.wbg.__wbg_uniform2fv_2bdc308ea239394d = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform2iv_b0dae1a78f34f320 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform3fv_c42dc21fa8dfe712 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform3fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform3iv_8aacf303310c1ef3 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform3iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform4fv_54aeb419c88f21df = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform4fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniform4iv_4864f7aa744dc21d = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform4iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};
imports.wbg.__wbg_uniformMatrix2fv_9fc7a7f246030d39 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix2fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};
imports.wbg.__wbg_uniformMatrix3fv_81c8f94bf3a05d08 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix3fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};
imports.wbg.__wbg_uniformMatrix4fv_caf5129a09f4f267 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix4fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};
imports.wbg.__wbg_activeTexture_1ba5758f0a8358b6 = function(arg0, arg1) {
    getObject(arg0).activeTexture(arg1 >>> 0);
};
imports.wbg.__wbg_attachShader_0867104b37cae2d6 = function(arg0, arg1, arg2) {
    getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
};
imports.wbg.__wbg_bindBuffer_28e62f648e99e251 = function(arg0, arg1, arg2) {
    getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_bindFramebuffer_b7a06305d2823b34 = function(arg0, arg1, arg2) {
    getObject(arg0).bindFramebuffer(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_bindRenderbuffer_0fe389ab46c4d00d = function(arg0, arg1, arg2) {
    getObject(arg0).bindRenderbuffer(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_bindTexture_27a724e7303eec67 = function(arg0, arg1, arg2) {
    getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
};
imports.wbg.__wbg_blendColor_cfd863563682d577 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).blendColor(arg1, arg2, arg3, arg4);
};
imports.wbg.__wbg_blendEquation_33be7d5bece19805 = function(arg0, arg1) {
    getObject(arg0).blendEquation(arg1 >>> 0);
};
imports.wbg.__wbg_blendEquationSeparate_ffbed0120340f7d5 = function(arg0, arg1, arg2) {
    getObject(arg0).blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
};
imports.wbg.__wbg_blendFunc_08a6e279418be6da = function(arg0, arg1, arg2) {
    getObject(arg0).blendFunc(arg1 >>> 0, arg2 >>> 0);
};
imports.wbg.__wbg_blendFuncSeparate_c750720abdc9d54e = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};
imports.wbg.__wbg_colorMask_0cfe7588f073be4e = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
};
imports.wbg.__wbg_compileShader_1b371763cfd802f7 = function(arg0, arg1) {
    getObject(arg0).compileShader(getObject(arg1));
};
imports.wbg.__wbg_copyTexSubImage2D_6b89ac2e1ddd3142 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    getObject(arg0).copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
};
imports.wbg.__wbg_createBuffer_48c0376fc0746386 = function(arg0) {
    const ret = getObject(arg0).createBuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createFramebuffer_f6f4aff3c462de89 = function(arg0) {
    const ret = getObject(arg0).createFramebuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createProgram_c2675d2cc83435a6 = function(arg0) {
    const ret = getObject(arg0).createProgram();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createRenderbuffer_5f8fcf55de2b35f5 = function(arg0) {
    const ret = getObject(arg0).createRenderbuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createShader_8d2a55e7777bbea7 = function(arg0, arg1) {
    const ret = getObject(arg0).createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createTexture_23de5d8f7988e663 = function(arg0) {
    const ret = getObject(arg0).createTexture();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_cullFace_ebd111d9d3c6e6cb = function(arg0, arg1) {
    getObject(arg0).cullFace(arg1 >>> 0);
};
imports.wbg.__wbg_deleteBuffer_84d0cd43f3b572b6 = function(arg0, arg1) {
    getObject(arg0).deleteBuffer(getObject(arg1));
};
imports.wbg.__wbg_deleteFramebuffer_b21de2b43d8c54e0 = function(arg0, arg1) {
    getObject(arg0).deleteFramebuffer(getObject(arg1));
};
imports.wbg.__wbg_deleteProgram_7044d91c29e31f30 = function(arg0, arg1) {
    getObject(arg0).deleteProgram(getObject(arg1));
};
imports.wbg.__wbg_deleteRenderbuffer_6d9875ba7b9df6c3 = function(arg0, arg1) {
    getObject(arg0).deleteRenderbuffer(getObject(arg1));
};
imports.wbg.__wbg_deleteShader_d39446753b2fa1e7 = function(arg0, arg1) {
    getObject(arg0).deleteShader(getObject(arg1));
};
imports.wbg.__wbg_deleteTexture_bf4ea3b750a15992 = function(arg0, arg1) {
    getObject(arg0).deleteTexture(getObject(arg1));
};
imports.wbg.__wbg_depthFunc_022b02671d0567ca = function(arg0, arg1) {
    getObject(arg0).depthFunc(arg1 >>> 0);
};
imports.wbg.__wbg_depthMask_e3ae6240c69ee7c3 = function(arg0, arg1) {
    getObject(arg0).depthMask(arg1 !== 0);
};
imports.wbg.__wbg_depthRange_23a9a11ab36ef4f7 = function(arg0, arg1, arg2) {
    getObject(arg0).depthRange(arg1, arg2);
};
imports.wbg.__wbg_disable_ada50e27543b1ebd = function(arg0, arg1) {
    getObject(arg0).disable(arg1 >>> 0);
};
imports.wbg.__wbg_disableVertexAttribArray_e1c513cfd55355c9 = function(arg0, arg1) {
    getObject(arg0).disableVertexAttribArray(arg1 >>> 0);
};
imports.wbg.__wbg_drawArrays_b8da4ee5bc9599f6 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
};
imports.wbg.__wbg_drawElements_efa6c15e2787a58c = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
};
imports.wbg.__wbg_enable_981a414a11bbed87 = function(arg0, arg1) {
    getObject(arg0).enable(arg1 >>> 0);
};
imports.wbg.__wbg_enableVertexAttribArray_1d5f3ff6e7da7095 = function(arg0, arg1) {
    getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
};
imports.wbg.__wbg_framebufferRenderbuffer_ed95c4854179b4ac = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4));
};
imports.wbg.__wbg_framebufferTexture2D_3bb72a24d7618de9 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4), arg5);
};
imports.wbg.__wbg_frontFace_27420a02ba896aee = function(arg0, arg1) {
    getObject(arg0).frontFace(arg1 >>> 0);
};
imports.wbg.__wbg_getActiveUniform_6e926ae8849b7b41 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getActiveUniform(getObject(arg1), arg2 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_getParameter_f511b92ebf87c44e = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).getParameter(arg1 >>> 0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getProgramInfoLog_e70b0120bda14895 = function(arg0, arg1, arg2) {
    const ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_getProgramParameter_e4fe54d806806081 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_getShaderInfoLog_95d068aeccc5dbb3 = function(arg0, arg1, arg2) {
    const ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_getShaderParameter_2972af1cb850aeb7 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_getUniformLocation_776a1f58e7904d81 = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg0).getUniformLocation(getObject(arg1), v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_linkProgram_b98c8967f45a44fd = function(arg0, arg1) {
    getObject(arg0).linkProgram(getObject(arg1));
};
imports.wbg.__wbg_pixelStorei_707653d2f29a6c67 = function(arg0, arg1, arg2) {
    getObject(arg0).pixelStorei(arg1 >>> 0, arg2);
};
imports.wbg.__wbg_polygonOffset_6988d578ba78ac1f = function(arg0, arg1, arg2) {
    getObject(arg0).polygonOffset(arg1, arg2);
};
imports.wbg.__wbg_renderbufferStorage_56e5cf7c10bbc044 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
};
imports.wbg.__wbg_scissor_056d185c74d7c0ad = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).scissor(arg1, arg2, arg3, arg4);
};
imports.wbg.__wbg_shaderSource_daca520f63ef8fca = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    getObject(arg0).shaderSource(getObject(arg1), v0);
};
imports.wbg.__wbg_stencilFuncSeparate_a67fd2aea52446dd = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
};
imports.wbg.__wbg_stencilMask_9ea2bf2fb1616a9b = function(arg0, arg1) {
    getObject(arg0).stencilMask(arg1 >>> 0);
};
imports.wbg.__wbg_stencilMaskSeparate_e3efaa9509ba397b = function(arg0, arg1, arg2) {
    getObject(arg0).stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
};
imports.wbg.__wbg_stencilOpSeparate_a189d6338679f86f = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};
imports.wbg.__wbg_texParameteri_1298d8804b59bbc0 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};
imports.wbg.__wbg_uniform1f_bb331865fe6d123b = function(arg0, arg1, arg2) {
    getObject(arg0).uniform1f(getObject(arg1), arg2);
};
imports.wbg.__wbg_uniform1i_42b99e992f794a51 = function(arg0, arg1, arg2) {
    getObject(arg0).uniform1i(getObject(arg1), arg2);
};
imports.wbg.__wbg_uniform4f_3064c1608d684501 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).uniform4f(getObject(arg1), arg2, arg3, arg4, arg5);
};
imports.wbg.__wbg_useProgram_022d72a653706891 = function(arg0, arg1) {
    getObject(arg0).useProgram(getObject(arg1));
};
imports.wbg.__wbg_vertexAttribPointer_a75ea424ba9fa4e8 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
};
imports.wbg.__wbg_viewport_6c864379ded67e8a = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).viewport(arg1, arg2, arg3, arg4);
};
imports.wbg.__wbg_setAttribute_8d90e00d652037be = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setAttribute(v0, v1);
}, arguments) };
imports.wbg.__wbg_href_ee02b91ff794f1c0 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).href;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_status_600fd8b881393898 = function(arg0) {
    const ret = getObject(arg0).status;
    return ret;
};
imports.wbg.__wbg_ok_1538f4695dab1792 = function(arg0) {
    const ret = getObject(arg0).ok;
    return ret;
};
imports.wbg.__wbg_headers_9e7f2c05a9b962ea = function(arg0) {
    const ret = getObject(arg0).headers;
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithoptbuffersourceandinit_0066af3a63a2b7e1 = function() { return handleError(function (arg0, arg1) {
    const ret = new Response(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_arrayBuffer_5a99283a3954c850 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).arrayBuffer();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_x_2006af4677b9b504 = function(arg0) {
    const ret = getObject(arg0).x;
    return ret;
};
imports.wbg.__wbg_y_425db9b320ad3faa = function(arg0) {
    const ret = getObject(arg0).y;
    return ret;
};
imports.wbg.__wbg_z_da3c9d69ec691797 = function(arg0) {
    const ret = getObject(arg0).z;
    return ret;
};
imports.wbg.__wbg_w_0997ca5b2fdee4b9 = function(arg0) {
    const ret = getObject(arg0).w;
    return ret;
};
imports.wbg.__wbg_drawBuffersWEBGL_ec71613a6df0ca89 = function(arg0, arg1) {
    getObject(arg0).drawBuffersWEBGL(getObject(arg1));
};
imports.wbg.__wbg_setonmessage_c5d351beda541fb3 = function(arg0, arg1) {
    getObject(arg0).onmessage = getObject(arg1);
};
imports.wbg.__wbg_new_0cc1b88a04ca7dfe = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Worker(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_postMessage_d1c36bea184c18f2 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).postMessage(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_renderState_4f8f7083d990c017 = function(arg0) {
    const ret = getObject(arg0).renderState;
    return addHeapObject(ret);
};
imports.wbg.__wbg_inputSources_e218a8456a2b3917 = function(arg0) {
    const ret = getObject(arg0).inputSources;
    return addHeapObject(ret);
};
imports.wbg.__wbg_requestAnimationFrame_a96b658a75a1de66 = function(arg0, arg1) {
    const ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
    return ret;
};
imports.wbg.__wbg_requestReferenceSpace_aaf987ec1f20dd74 = function(arg0, arg1) {
    const ret = getObject(arg0).requestReferenceSpace(takeObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_updateRenderState_efe81e26390ced05 = function(arg0, arg1) {
    getObject(arg0).updateRenderState(getObject(arg1));
};
imports.wbg.__wbg_requestSession_6969affd232a6860 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).requestSession(takeObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_bindVertexArrayOES_35d97084dfc5f6f4 = function(arg0, arg1) {
    getObject(arg0).bindVertexArrayOES(getObject(arg1));
};
imports.wbg.__wbg_createVertexArrayOES_69c38b2b74e927fa = function(arg0) {
    const ret = getObject(arg0).createVertexArrayOES();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_deleteVertexArrayOES_7944a9952de94807 = function(arg0, arg1) {
    getObject(arg0).deleteVertexArrayOES(getObject(arg1));
};
imports.wbg.__wbg_position_d25f93724f540db6 = function(arg0) {
    const ret = getObject(arg0).position;
    return addHeapObject(ret);
};
imports.wbg.__wbg_orientation_f0539e0263796e35 = function(arg0) {
    const ret = getObject(arg0).orientation;
    return addHeapObject(ret);
};
imports.wbg.__wbg_matrix_22f9a22d2a44286e = function(arg0, arg1) {
    const ret = getObject(arg1).matrix;
    const ptr0 = passArrayF32ToWasm0(ret, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_inverse_641bc25bbdb433a7 = function(arg0) {
    const ret = getObject(arg0).inverse;
    return addHeapObject(ret);
};
imports.wbg.__wbg_get_590a2cd912f2ae46 = function(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};
imports.wbg.__wbg_length_2cd798326f2cc4c1 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_new_94fb1279cf6afea5 = function() {
    const ret = new Array();
    return addHeapObject(ret);
};
imports.wbg.__wbg_newnoargs_e23b458e372830de = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Function(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_get_a9cab131e3152c49 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_call_ae78342adc33730a = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_36359baae5a47e27 = function() {
    const ret = new Object();
    return addHeapObject(ret);
};
imports.wbg.__wbg_self_99737b4dcdf6f0d8 = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_window_9b61fbbf3564c4fb = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_globalThis_8e275ef40caea3a3 = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_global_5de1e0f82bddcd27 = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_encodeURIComponent_7a49218d9d8a2265 = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = encodeURIComponent(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_of_9432de44616bd927 = function(arg0) {
    const ret = Array.of(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_of_917b7a7a78de4453 = function(arg0, arg1, arg2) {
    const ret = Array.of(getObject(arg0), getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_push_40c6a90f1805aa90 = function(arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1));
    return ret;
};
imports.wbg.__wbg_call_3ed288a247f13ea5 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_is_40969b082b54c84d = function(arg0, arg1) {
    const ret = Object.is(getObject(arg0), getObject(arg1));
    return ret;
};
imports.wbg.__wbg_new_37705eed627d5ed9 = function(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_684(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};
imports.wbg.__wbg_resolve_a9a87bdd64e9e62c = function(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_ce526c837d07b68f = function(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_842e65b843962f56 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_buffer_7af23f65f6c64548 = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithbyteoffsetandlength_293152433089cf24 = function(arg0, arg1, arg2) {
    const ret = new Int8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithbyteoffsetandlength_20bd70cc8d50ee94 = function(arg0, arg1, arg2) {
    const ret = new Int16Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithbyteoffsetandlength_0d4e0750590b10dd = function(arg0, arg1, arg2) {
    const ret = new Int32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_7fb6d86dfb4bf8c1 = function(arg0) {
    const ret = new Int32Array(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithbyteoffsetandlength_ce1e75f0ce5f7974 = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_cc9018bd6f283b6f = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_set_f25e869e4565d2a2 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};
imports.wbg.__wbg_length_0acb1cf9bbaf8519 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_newwithbyteoffsetandlength_729246f395bbffc0 = function(arg0, arg1, arg2) {
    const ret = new Uint16Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithbyteoffsetandlength_bbdb045c2c009495 = function(arg0, arg1, arg2) {
    const ret = new Uint32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithbyteoffsetandlength_3f554978d8793b14 = function(arg0, arg1, arg2) {
    const ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_construct_2987400289ad2ff0 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.construct(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_93b1c87ee2af852e = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};
imports.wbg.__wbindgen_module = function() {
    const ret = init.__wbindgen_wasm_module;
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper689 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 123, __wbg_adapter_32);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper691 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 123, __wbg_adapter_35);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper6037 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1833, __wbg_adapter_38);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper6039 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1833, __wbg_adapter_41);
    return addHeapObject(ret);
};

if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
    input = fetch(input);
}

imports.wbg.memory = maybe_memory || new WebAssembly.Memory({initial:33,maximum:16384,shared:true});

const { instance, module } = await load(await input, imports);

wasm = instance.exports;
init.__wbindgen_wasm_module = module;
wasm.__wbindgen_start();
return wasm;
}

export default init;

