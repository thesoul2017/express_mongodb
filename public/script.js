// get all heroes
function getHeroes() {
    $.ajax({
        url: "/api/heroes",
        type: "GET",
        contentType: "application/json",
        success: function (heroes) {
            var rows = "";
            $.each(heroes, function (index, hero) {
                rows += row(hero);
            })
            $("table tbody").append(rows);
        }
    });
}

// get hero
function getHero(id) {
    $.ajax({
        url: "/api/heroes/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (hero) {
            var form = document.forms["heroForm"];
            form.elements["id"].value = hero._id;
            form.elements["name"].value = hero.name;
            form.elements["power"].value = hero.power;
        }
    });
}

// add hero
function addHero(heroName, heroPower) {
    $.ajax({
        url: "api/heroes",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: heroName,
            power: heroPower
        }),
        success: function (hero) {
            reset();
            $("table tbody").append(row(hero));
        }
    })
}

// edit hero
function editHero(heroId, heroName, heroPower) {
    $.ajax({
        url: "api/heroes",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: heroId,
            name: heroName,
            power: heroPower
        }),
        success: function (hero) {
            reset();
            console.log(hero);
            $("tr[data-rowid='" + hero._id + "']").replaceWith(row(hero));
        }
    })
}

// del hero
function deleteHero(id) {
    $.ajax({
        url: "api/heroes/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function (hero) {
            console.log(hero);
            $("tr[data-rowid='" + hero._id + "']").remove();
        }
    })
}

// reset form
function reset() {
    var form = document.forms["heroForm"];
    form.reset();
    form.elements["id"].value = 0;
    console.log("reset");
}

// add row in table
var row = function (hero) {
    return "<tr data-rowid='" + hero._id + "'><td>" + hero._id + "</td>" +
        "<td>" + hero.name + "</td> <td>" + hero.power + "</td>" +
        "<td><a class='editLink' data-id='" + hero._id + "'>Edit</a> | " +
        "<a class='removeLink' data-id='" + hero._id + "'>Delete</a></td></tr>";
}

$("#reset").click(function (e) {
    e.preventDefault();
    reset();
});

// button edit
$("body").on("click", ".editLink", function () {
    var id = $(this).data("id");
    getHero(id);
});

// button del
$("body").on("click", ".removeLink", function () {
    var id = $(this).data("id");
    deleteHero(id);
});

// save
$("form").submit(function (e) {
    e.preventDefault();
    var id = this.elements["id"].value;
    var name = this.elements["name"].value;
    var power = this.elements["power"].value;
    if (id == 0)
        addHero(name, power);
    else
        editHero(id, name, power);
});

// load heroes
getHeroes();