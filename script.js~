
const readHoon = (hoonFile) => new Promise((res) => {
    fetch(hoonFile).then(async el => {
       return el.text()
    }).then(text => {
        res(text)
    })
})

const createDebuggerElement = (hoonFile) => {
    return async (args) => {
        const hoon = await readHoon(hoonFile)

        const fragmentSeperator = document.createDocumentFragment();
        const fragmentCode = document.createDocumentFragment();
        const fragmentArgs = document.createDocumentFragment();
        const fragmentAnswer = document.createDocumentFragment();

        const code = fragmentCode.appendChild(document.createElement("code"));
        code.textContent = hoon;
        
        const pSep = fragmentArgs.appendChild(document.createElement("p"));
        const pArgs = fragmentArgs.appendChild(document.createElement("p"));
        const p = fragmentAnswer.appendChild(document.createElement("p"));
        
        pSep.textContent = '----'
        if(args) pArgs.textContent = args.length > 1 ? 'inputs: ' + args : 'input: ' + args
        if(args) p.textContent = 'output: ' + compiler(hoon, 0, false)(...args)
        else p.textContent = 'output: ' +compiler(hoon, 0, false)
        
        document.getElementById('anchor').appendChild(fragmentSeperator)
        document.getElementById('anchor').appendChild(fragmentArgs)
        document.getElementById('anchor').appendChild(fragmentCode)
        document.getElementById('anchor').appendChild(fragmentAnswer)
    }
}

(async () => {
    await createDebuggerElement('./gen/gen1.hoon')([1,2])
    // await createDebuggerElement('./gen/if.hoon')([1,2])
    // await createDebuggerElement('./gen/trap.hoon')([10])
    
    await createDebuggerElement('./gen/flexCash.hoon')()
    await createDebuggerElement('./gen/flexFlecCash.hoon')()
    await createDebuggerElement('./gen/composed1.hoon')()
    await createDebuggerElement('./gen/composed2.hoon')()
    await createDebuggerElement('./gen/composed3.hoon')()
})()
