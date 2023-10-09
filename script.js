const container = document.getElementById('all-players-container');
const formContainer = document.getElementById('new-player-form');

const cohort = '2305-ftb-pt-web-pt';
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohort}`;
const PLAYERS_API_URL = `${API_URL}/players`;

const fetchAll = async () => {
    try {
        const response = await fetch(PLAYERS_API_URL);
        const players = await response.json();
        return players.data.players;
    } catch (err) {
        console.error('Error fetching players!', err);
    }
};

const fetchPlayer = async (playerId) => {
    try {
        const response = await fetch(`${API_URL}/${playerId}`);
        const player = await response.json();
        return player
    } catch (err) {
        console.error(`Error fetching player #${playerId}!`, err);
    }
};

const addPlayer = async (playerObj) => {
    try {
        const response = await fetch(PLAYERS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerObj)
        });
        const data = await response.json();

        return data;

    } catch (err) {
        console.error('Error adding player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${PLAYERS_API_URL}/${playerId}`, {
            method: 'DELETE'
        });
        const player = await response.json();
        return player;
    } catch (err) {
        console.error(
            `Error removing player #${playerId} from the roster!`,
            err
        );
    }
};

const renderPlayers = (playerList) => {
    try {
        container.innerHTML = "";
        playerList.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player');
            playerElement.innerHTML = `
                <h2>${player.name}</h2>
                <p>${player.id}</p>
                <p>${player.breed}</p>
                <p>${player.status}</p>
                <img src="${player.imageUrl}" alt="img"/>
                <button class="details-button" data-id="${player.id}">See Details</button>
                <button class="delete-button" data-id="${player.id}">Remove from roster</button>
                `;
            container.appendChild(playerElement);
        });
    } catch (err) {
        console.error('Error rendering players!', err);
    }
};

const renderForm = () => {
    try {
        const form = document.querySelector('#new-player-form');
        form.innerHTML = `
          <form>
            <label for="name">Name</label>
            <input type="text" name="name" id="name" />
            <label for="breed">Breed</label>
            <input type="text" name="breed" id="breed" />
            <label for="status">Status</label>
            <input type="text" name="status" id="status" />
            <label for="img">Image URL</label>
            <input type="text" name="img" id="img" />
            <label for="teamId">Team</label>
            <input type="text" name="teamId" id="teamId" />
            <button type="submit">Submit</button>
          </form>
          `;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const breed = document.getElementById('breed').value;
            const status = document.getElementById('status').value;
            const imageUrl = document.getElementById('img').value;
            const teamId = document.getElementById('teamId').value;

            const newPlayer = {
                name: name,
                breed: breed,
                status: status,
                imageUrl: imageUrl,
                teamId: teamId
            };

            await addPlayer(newPlayer);
            const players = await fetchAll();
            renderPlayers(players);
        });
    } catch (err) {
        console.error('Error rendering the new player form!', err);
    }
}

const initialize = async () => {
    const players = await fetchAll();
    renderPlayers(players);

    renderForm();  
}

initialize();


