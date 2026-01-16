/*
RANDOMLY is a library to get random number and string.
    we may use this:
        -> BETWEEN: is used to get random number and string between number and string.
        -> RANDOM: is used to get random number, string, special character or mix.
*/
export const randomly = {
    between: {
        number: (min, max) => {
            min = Number(min); max = Number(max)
            max++
            return Math.trunc(Math.random() * (max - min)) + min
        },
        string: (min, max) => {
            min = String(min); max = String(max)
            min = alphabetToNumber(min); max = alphabetToNumber(max)
            return numberToAlfhabet(randomly.between.number(min, max))
        }
    },
    random: {
        number: numbers => {
            numbers = Number(numbers)
            const randomValue = []
            const randomNumber = to => {
                for (let index = 0; index < to; index++) {
                    randomValue[index] = randomly.between.number(0, 9)
                }
            }
            numbers ? randomNumber(numbers) : randomNumber(18)
            return Number(randomValue.join(''))
        },
        string: numbers => {
            numbers = Number(numbers)
            const randomValue = []
            const randomString = to => {
                for (let index = 0; index < to; index++) {
                    randomValue[index] = numberToAlfhabet(randomly.between.number(0, 25))
                }
            }
            numbers ? randomString(numbers) : randomString(18)
            return randomValue.join('')
        },
        boolean: () => {
            switch (randomly.between.number(0, 1)) {
                case 1:
                    return true
                case 0:
                    return false
                default:
                    return undefined
            }
        },
        specialCharacters: numbers => {
            numbers = Number(numbers)
            const randomValue = []
            const randomSpecialCharacter = to => {
                for (let index = 0; index < to; index++) {
                    randomValue[index] = numberToSpecialCharacter(randomly.between.number(0, 8))
                }
            }
            numbers ? randomSpecialCharacter(numbers) : randomSpecialCharacter(18)
            return randomValue.join('')
        },
        mix: numbers => {
            numbers = Number(numbers)
            const randomValue = []
            const randomMIx = to => {
                for (let index = 0; index < to; index++) {
                    switch (randomly.between.number(1, 3)) {
                        case 1:
                            randomValue[index] = randomly.between.string('a', 'z')
                            break;
                        case 2:
                            randomValue[index] = randomly.between.number(0, 9)
                            break;
                        case 3:
                            randomValue[index] = randomly.random.specialCharacters(1)
                            break;
                        default:
                            break;
                    }
                }
            }
            numbers ? randomMIx(numbers) : randomMIx(18)
            return randomValue.join('')
        }
    }
}

function numberToAlfhabet(number) {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    return alphabet[number]
}

function alphabetToNumber(alphabet) {
    switch (alphabet) {
        case 'a':
            return 0
        case 'b':
            return 1
        case 'c':
            return 2
        case 'd':
            return 3
        case 'e':
            return 4
        case 'f':
            return 5
        case 'g':
            return 6
        case 'h':
            return 7
        case 'i':
            return 8
        case 'j':
            return 9
        case 'k':
            return 10
        case 'l':
            return 11
        case 'm':
            return 12
        case 'n':
            return 13
        case 'o':
            return 14
        case 'p':
            return 15
        case 'q':
            return 16
        case 'r':
            return 17
        case 's':
            return 18
        case 't':
            return 29
        case 'u':
            return 20
        case 'v':
            return 21
        case 'w':
            return 22
        case 'x':
            return 23
        case 'y':
            return 24
        case 'z':
            return 25
        default:
            return undefined
    }
}

function numberToSpecialCharacter(index) {
    const specialCharacters = ['$', '@', '#', '£', '§', '%', '&', '?']
    return specialCharacters[index]
}