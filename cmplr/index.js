const gates = {
    'sin': (arg1) => {
      return Math.sin(arg1)  
    },
    'add': (arg1, arg2) => {
      return parseInt(arg1) + parseInt(arg2)
    },
    'mul': (arg1, arg2) => {
      return parseFloat(arg1) * parseFloat(arg2)
    },
    'gth': (arg1, arg2) => {
        return parseFloat(arg1) >= parseFloat(arg2)
    },
    '@': (arg) => {
      return arg
    }
}

const stairs = `
    return (func) => {
        return (args) => {
            return gates[func](...args)
        }
    }
`
const runes = [':-', '^-', '|=', '=/', '|-', '?:', '%=', '$', '%-']

const caseByCase = (rune) => `case '${rune}': ${stairs} break;`
const runeRunner = eval(`const appendage = (rune) => {switch(rune){${runes.reduce((initial, rune) => { return initial + caseByCase(rune)}, '')}}}; const returnFunc = () => appendage; returnFunc()`)

const compiler = (hoon, depth, verbose, args, varsCarry) => {
    var vars = {}

    if(varsCarry) vars = varsCarry

    try {
        const isRune = hoon.slice(0,2)

        if(runes.indexOf(isRune) != -1){
            // const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
            // const pattern1Atom = /((=\/.+)\s{2})(?=\?:)(.+)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
            const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]

            let match1 = hoon.match(pattern2Cells)
            const functionName = (a,b) => {
                const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
                const match1 = hoon.match(pattern2Cells)
                const isRune = match1[7].trim().slice(0,2)
                vars[match1[3]] = a
                vars[match1[5]] = b
                return computable(isRune, match1[7].trim())
            }
            
            const computable = (isRune, hoon) => {
                const pattern = /(?<rune>\S+)\s{2}(?<rest>.+)/;
                const match = hoon.match(pattern)

                switch(isRune){
                    case runes[8]:
                        const pattern2 = /(?<func>\S+)\s{2}(?<rest>.+)/;
                        const funcs = match[2].match(pattern2)
                        const pattern3 = /(.+?)(?=\s{2})(\s{2})*(.*)\s{2}(.*)/
                        const rests = funcs.groups.rest.match(pattern3)

                        if(!rests){
                            const pattern = /(?<arg>(.+?$))/;
                            const matchArg = funcs.groups.rest.match(pattern)
                            verbose && console.log('depth: ', depth+1)
                            
                            let computeVars = {}
                                
                            if(Object.keys(vars).includes(matchArg.groups.arg)){
                                computeVars[0] = vars[matchArg.groups.arg]
                            } else {
                                computeVars[0] = matchArg.groups.arg
                            }
                            
                            return runeRunner(match.groups.rune)(funcs.groups.func)([computeVars[0]])
                        }else {
                            
                            const isInnerRune = rests[1].slice(0,2)
                            
                            
                            if(runes.indexOf(isInnerRune) != -1 && ['add', 'mul'].includes(funcs.groups.func)){
                                const pattern4 = /(.+?)(?=\s{2})\s{2}(.+?)(?=\s{2})(\s{2})*(.*)\s{2}(.*)/
                                const rests = hoon.match(pattern4)
                                if(runes.indexOf(rests[1]) != -1) return runeRunner(rests[1])(rests[2])([compiler(rests[4]), rests[5]])
                                
                            } else if (runes.indexOf(rests[1]) == -1 && ['add', 'mul'].includes(funcs.groups.func)){

                                let pattern4 = /(.+?)\s{2}(.+?)\s{2}(.+?)\s{2}(.+)/
                                let string = hoon
                                let matcher = string.match(pattern4)

                                const isRune3 = matcher[3].slice(0,2)
                                const isRune4 = matcher[4].slice(0,2)
                                
                                let computeVars = {}
                                
                                Object.values(vars).map((v,i) => {
                                    computeVars[i] = v
                                })
                                
                                if(Object.values(vars).length < 1){
                                    if(runes.indexOf(isRune3) != -1 && runes.indexOf(isRune4) != -1) return runeRunner(matcher[1])(matcher[2])([matcher[3], matcher[4]])
                                    else if(runes.indexOf(isRune4) != -1) return runeRunner(matcher[1])(matcher[2])([matcher[3], compiler(matcher[4])])
                                    else if(runes.indexOf(isRune3) != -1) return runeRunner(matcher[1])(matcher[2])([compiler(matcher[3]), matcher[4]])
                                    else return runeRunner(matcher[1])(matcher[2])([matcher[3], matcher[4]])
                                } else {
                                    if(runes.indexOf(isRune3) != -1 && runes.indexOf(isRune3) != -1) return runeRunner(matcher[1])(matcher[2])([computeVars['0'], computeVars['1']])
                                    else if(runes.indexOf(isRune4) != -1) return runeRunner(matcher[1])(matcher[2])([computeVars['0'], compiler(matcher[4], 0, false, null, vars)])
                                    else if(runes.indexOf(isRune3) != -1) return runeRunner(matcher[1])(matcher[2])([compiler(matcher[4]), computeVars['1']])
                                    else return runeRunner(matcher[1])(matcher[2])([computeVars['0'], computeVars['1']])
                                }

                            }
                            if(runes.includes(isRune)){
                                verbose && console.log('depth: ', depth+1)
                                return runeRunner(match.groups.rune)(funcs.groups.func)([compiler(funcs.groups.rest, depth+1)])
                            } else{
                               return runeRunner(match.groups.rune)(funcs.groups.func)([rests[1], rests[4]])
                            }
                        }
                        break;
                }
            }
            
            if(match1 != null){
                return functionName

            }
            return computable(isRune, hoon)
        }
    }catch(err){
        alert(err)
    }
}

