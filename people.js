const readline = require("readline");
const fs = require("fs/promises");

const PEOPLE_FILE_NAME = 'people.json';

const ACTION_ADD = 1;
const ACTION_DELETE = 2;
const ACTION_LIST = 3;
const ACTION_FINISH = 0;

let selectecAction = ACTION_LIST;

const inputOutput = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function inputText(message) {
    return new Promise((resolve) => {
        inputOutput.question(message, (answer) => {
            resolve(answer);
        });
    });
}

function inputNumber(message) {
    return new Promise((resolve, reject) => {
        inputOutput.question(message, (answer) => {
            const input = parseFloat(answer);
            const isValid = !isNaN(input) && Number.isFinite(input);
            
            isValid ? resolve(input) : reject(new Error(`${answer} is not a number`));
        });
    });
}

async function writeJSON(fileName, array) {
    try {
        await fs.writeFile(fileName, JSON.stringify(array), {
            encoding: "utf-8"
        });
    } catch (error) {
        console.log("Failed to write to file", error);
    }
}

meniu();

function showInfo() {
    console.log(`
        1. prideti nauja zmogu
        2. istrinti zmogu
        3. isvesti visus zmones
        0. pabaigti
    `);
}

async function meniu() {
    showInfo();

    try {
        selectedAction = await inputNumber("Pasirink optiona: ");
    } catch(err) {
        console.log('prasau ivesti skaiciu');
    }

    await main();
    inputOutput.close();
}

async function addAction() {
    let people = [];

    try {
        people = JSON.parse(await fs.readFile(PEOPLE_FILE_NAME));
    } catch (error) {
        console.log('Error: ' + error);
    }

    people.push({
        name: await inputText("Input name: "),
        surname: await inputText("Input surname: "),
        salary: await inputText("Input salary: ")
    });

    await writeJSON(PEOPLE_FILE_NAME, people);
}

async function listAction() {
    try {
        let people = JSON.parse(await fs.readFile(PEOPLE_FILE_NAME));

        for (let i of people) {
            console.log(i);
        }
    } catch (error) {
        console.log("Failed to read file");
    }
}

async function deleteAction() {
    try {
        let people = JSON.parse(await fs.readFile(PEOPLE_FILE_NAME));
        let personToBeDeleted = await inputText("Input doomed persons name: ");

        const filteredPeopleList = people.filter(element => element.name !== personToBeDeleted);
        await writeJSON(PEOPLE_FILE_NAME, filteredPeopleList);
        console.log(filteredPeopleList);
    } catch (error) {
        console.log("there is nothing to be deleted");
    }
}

async function main() {
    if (selectedAction === ACTION_FINISH) {
        console.log("Chiao bambynos!");
        inputOutput.close();
    } else {
        if (selectedAction === ACTION_ADD) {
            await addAction();
        } else if (selectedAction === ACTION_DELETE) {
            await deleteAction();
        } else if (selectedAction === ACTION_LIST) {
            await listAction();
        }
    
        await meniu();
    }
}
/*
zmoniu sarasas

vienas zmogus atrodo taip:
{
    vardas: "Jonas"
    pavarde: "Jonaitis",
    alga: 123.48
}

parodom meniu:
1. atspausdinti visus zmones
2. prideti nauja
3. istrinti zmogu
0. pabaigti

duomenys saugomi faile zmones.json
jei failo nera - programa sukuria faila pirmo pridejimo metu

1. perskaitom is zmones.json ir parodom sarasa (su numeriais)
jei failo nera - nieko nespausdinam
2. papraso ivesti varda, pavarde, alga
prideda nauja zmogu i sarasa (prie failo, jei nera sukuria)
3. papraso ivesti numeri (is saraso) zmogaus, kuri reikia istrinti
istrina is saraso ir perraso faila
0. baigia darba

selectedActionus neegzistuojanti meniu punkta (jei ivede ne 0, 1, 2, 3, tai vel spausdinti meniu)

*)
4. turtuoliu sarsas
papraso ivesti skaiciu
atspausdina visus zmones, kuriu alga didesne uz ivesta skaiciu

*/
