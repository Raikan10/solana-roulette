import * as web3 from '@solana/web3.js'
import * as fs from 'fs'

const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

export const createNewWallet = () => {
    const userWallet = web3.Keypair.generate()
    fs.appendFile('wallets.txt', "\nWallet", (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });

    fs.appendFile('wallets.txt', userWallet.publicKey.toString(), (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });

    fs.appendFile('wallets.txt', userWallet.secretKey.toString(), (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });

    return userWallet;
}

export const airDropSol = async (publicKey) => {
    const airDropSignature = await connection.requestAirdrop(publicKey, 0.5 * web3.LAMPORTS_PER_SOL)
    await connection.confirmTransaction(airDropSignature)
}

export const getWalletBalance = async (publicKey) => {
    return await connection.getBalance(publicKey);

}


// fromPubKey = '7K96UCHtPctUwE87n9gieQjiyEvxXvQGwdJUfNAHbaXo'
// toPubKey = 'Eac9q9oD4gaNDUc8pzjvMLhHzikadYxQHGTSxszbnxBg'

// fromSecretKey = new Uint8Array([65, 29, 140, 147, 124, 208, 159, 123, 233, 42, 65, 67, 87, 177, 63, 189, 3, 91, 130, 12, 71, 70, 198, 31, 110, 119, 74, 141, 188, 103, 174, 103, 93, 203, 186, 118, 39, 133, 117, 247, 101, 61, 46, 244, 42, 171, 109, 106, 160, 136, 23, 185, 109, 188, 13, 139, 17, 34, 82, 12, 102, 60, 60, 206])


export const transferSol = async (from, to, amount) => {
    const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: amount
        })
    )
    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [from])
    return signature
}
