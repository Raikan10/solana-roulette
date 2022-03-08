import figlet from 'figlet'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { getReturnAmount, randomNumber } from './helper.js'
import { transferSol } from './solana.js'
import * as web3 from '@solana/web3.js'


const userWallet = web3.Keypair.fromSecretKey(new Uint8Array([65, 29, 140, 147, 124, 208, 159, 123, 233, 42, 65, 67, 87, 177, 63, 189, 3, 91, 130, 12, 71, 70, 198, 31, 110, 119, 74, 141, 188, 103, 174, 103, 93, 203, 186, 118, 39, 133, 117, 247, 101, 61, 46, 244, 42, 171, 109, 106, 160, 136, 23, 185, 109, 188, 13, 139, 17, 34, 82, 12, 102, 60, 60, 206]))
const treasuryWallet = web3.Keypair.fromSecretKey(new Uint8Array([154, 26, 23, 169, 249, 73, 25, 149, 75, 24, 94, 154, 55, 80, 121, 124, 238, 64, 212, 231, 40, 255, 167, 19, 216, 154, 189, 58, 15, 65, 149, 129, 201, 195, 215, 240, 103, 96, 112, 83, 224, 186, 165, 43, 193, 160, 102, 220, 123, 49, 145, 204, 2, 215, 35, 95, 224, 105, 133, 197, 52, 108, 157, 239]))

console.log(chalk.green(figlet.textSync('Sol Stake')))
console.log(chalk.yellow("The max bidding amount is 1000 Lamports here"))

const askQuestions = () => {
    const questions = [{
        type: 'number', name: 'stakeAmount', message: 'What is the amount of Lamports you want to stake?', validate(input) {
            if (input > 1000) return "Stake Amount is too high"
            else return true
        }
    }, {
        type: "rawlist",
        name: "ratio",
        message: "What is the ratio of your staking?",
        choices: ["1:1.25", "1:1.5", "1:1.75", "1:2"],
        filter: function (val) {
            const stakeFactor = val.split(":")[1];
            return stakeFactor;
        },
    },
    {
        type: 'number', name: 'random', message: 'Guess a random number from 1 to 5 (both 1,5 included)', validate(input) {
            if (input < 1 || input > 5) return "Enter a number between 1 to 5"
            else return true
        }, when(answers) {
            console.log(`You need to pay ${chalk.green(answers.stakeAmount)} to move forward`)
            console.log(chalk.green(`You will get ${getReturnAmount(answers.stakeAmount, answers.ratio)} if guessing the number correctly`))
            return true
        }
    }]

    return inquirer.prompt(questions)
}

const gameExecution = async () => {
    const answers = await askQuestions()
    console.log(`Signature of payment for playing the game ${chalk.green(await transferSol(userWallet, treasuryWallet, answers.stakeAmount))}`)
    if (answers.random == randomNumber(1, 5)) {
        console.log(chalk.green`Your guess is absolutely correct`)
        console.log(`Here is the price signature ${chalk.green(await transferSol(treasuryWallet, userWallet, getReturnAmount(answers.stakeAmount)))}`)
    } else {
        console.log(chalk.yellow`Better Luck next time`)
    }
}

gameExecution();
