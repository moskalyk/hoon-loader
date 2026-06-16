const gates = {
    'sin': (arg1) => {
      return Math.sin(arg1)  
    },
    'add': (arg1, arg2) => {
      return parseInt(arg1) + parseInt(arg2)
    },
    'mul': (arg1, arg2) => {
      return parseInt(arg1) * parseInt(arg2)
    },
    'gth': (arg1, arg2) => {
        return parseInt(arg1) >= parseInt(arg2)
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

const compiler = (hoon, depth, verbose, args) => {

    try {
        const isRune = hoon.slice(0,2)

        if(runes.indexOf(isRune) != -1){

            const pattern = /(?<rune>\S+)\s{2}(?<rest>.+)/;
            const match = hoon.match(pattern)
            
            // const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
            // const pattern1Atom = /((=\/.+)\s{2})(?=\?:)(.+)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
            const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]

            let match1 = hoon.match(pattern2Cells)
            
            const functionName = (a,b) => {
                const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
                // const bounding = /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)\s{2}(?<arg3>.*)/
                const match1 = hoon.match(pattern2Cells)
                // alert(match1[7])
                const bounding = /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)/
                // alert(match1[7].trim())
                const match2 = match1[7].trim().match(bounding)
                
                let result;
                // alert('match1')
                // alert(match1)
                
                // result = runeRunner(match2.groups.rune)(match2.groups.func)(match1[3], match1[5])
                result = runeRunner(match2.groups.rune)(match2.groups.func)([a, b])
                if(result) return result
                // else return b
            }
            
            if(match1 != null){
                return functionName

            }

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

                        return runeRunner(match.groups.rune)(funcs.groups.func)([matchArg.groups.arg])
                    }else {
                    
                        const isRune = rests[1].slice(0,2)
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

                            if(runes.indexOf(isRune3) != -1 && runes.indexOf(isRune3) != -1) return runeRunner(matcher[1])(matcher[2])([matcher[3], matcher[4]])
                            else if(runes.indexOf(isRune4) != -1) return runeRunner(matcher[1])(matcher[2])([matcher[3], compiler(matcher[4])])
                            else if(runes.indexOf(isRune3) != -1) return runeRunner(matcher[1])(matcher[2])([compiler(matcher[3]), matcher[4]])
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
        // const pattern = /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)/;
    }catch(err){
        alert(err)
    }
}

