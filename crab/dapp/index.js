import Web3 from 'web3';
import Crab from '../build/contracts/Crab.json'

let web3;
let crab;

const initWeb3 = () => {
    return new Promise((resolve, reject) => {
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum);
            window.ethereum.enable()
                .then(() => {
                    resolve(
                        new Web3(window.ethereum)
                    );
                })
                .catch(e => {
                    reject(e);
                });
            return;
        }
        if (typeof window.web3 !== 'undefined') {
            return resolve(
                new Web3(window.web3.currentProvider)
            );
        }
        resolve(new Web3('http://localhost:9545'));
    });
};

const initContract = () => {
    const deploymentKeys = Object.keys(Crab.networks)[0];
    return new web3.eth.Contract(Crab.abi, Crab.networks[deploymentKeys].address);
};

const initApp = () => {
    const $create = document.getElementById('create');
    const $createResult = document.getElementById('create-result');

    const $read = document.getElementById('read');
    const $readResult = document.getElementById('read-result');

    const $append = document.getElementById('append');
    const $appendResult = document.getElementById('append-result');

    const $burn = document.getElementById('burn');
    const $burnResult = document.getElementById('burn-result');

    let accounts = [];

    web3.eth.getAccounts()
        .then(_accounts => {
            accounts = _accounts;
        });

    $create.addEventListener('submit', e => {
        e.preventDefault();

        const name = e.target.elements[0].value;
        const email = e.target.elements[1].value;

        crab.methods.create(name, email)
            .send({ from: accounts[0] })
            .then(() => {
                $createResult.innerHTML = `New user ${name} successfully created!`;
            })
            .catch(() => {
                $createResult.innerHTML = `Error on created user!`;
            });
    });

    $read.addEventListener('submit', e => {
        e.preventDefault();

        const email = e.target.elements[0].value;

        crab.methods.readByEmail(email)
            .call()
            .then(result => {
                $readResult.innerHTML = `Name: ${result}`;
            })
            .catch(() => {
                $createResult.innerHTML = `Error on read user!`;
            });
    });

    $append.addEventListener('submit', e => {
        e.preventDefault();

        const email = e.target.elements[0].value;
        const name = e.target.elements[1].value;

        crab.methods.append(name, email)
            .send({ from: accounts[0] })
            .then(() => {
                $appendResult.innerHTML = `User ${name} successfully appended, new e-mail ${email}!`;
            })
            .catch(() => {
                $appendResult.innerHTML = `Error on append user!`;
            });
    });

    $burn.addEventListener('submit', e => {
        e.preventDefault();

        const email = e.target.elements[0].value;

        crab.methods.burn(email)
            .send({ from: accounts[0] })
            .then(() => {
                $burnResult.innerHTML = `User ${email} successfully burned!`;
            })
            .catch(() => {
                $burnResult.innerHTML = `Error on burn user!`;
            });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
        .then(_web3 => {
            web3 = _web3;
            crab = initContract();
            initApp();
        })
        .catch(e => console.log(e.message));
});