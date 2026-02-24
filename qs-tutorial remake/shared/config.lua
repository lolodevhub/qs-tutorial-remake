Config = {}

Config.Speed = 5000

Config.Locations = {
    {
        coords = vector3(-647.00, -760.28, 284.39),
        heading = 263.50,
        image = "talk3.png",
        text = "Bienvenido a Capi Netta RP. Aqui no vendemos fantasias, vendemos decisiones. Cada paso que des va a construir tu nombre o enterrarlo. No hay destino escrito, solo reputacion. Y en esta ciudad, la reputacion vale mas que el dinero.",
        button = "Continuar",
        vibrate = true
    },
    {
        coords = vector3(-240.76, -997.58, 34.11),
        heading = 35.20,
        image = "rose.png",
        text = "Buscas trabajo? Perfecto. Aqui cambias horas por billetes y paciencia por oportunidades. Algunos empiezan firmando contratos, otros firmando su primera deuda. La diferencia la hace lo que estes dispuesto a hacer cuando nadie mira.",
        button = "Continuar",
        vibrate = true
    },
    {
        coords = vector3(408.89, -962.64, 28.13),
        heading = 239.08,
        image = "point.png",
        text = "La comisaria no es un edificio, es un filtro. Si cruzas esa puerta como ciudadano, podes salir igual. Si entras esposado, tu historia cambia. Aqui la ley pesa, pero la calle siempre responde.",
        button = "Continuar",
        vibrate = false
    },
    {
        coords = vector3(258.90, -598.08, 50.41),
        heading = 292.67,
        image = "talk3.png",
        text = "El hospital mantiene cuerpos en pie, pero no salva conciencias. Algunos salen curados, otros marcados. En esta ciudad, sobrevivir no siempre significa ganar.",
        button = "Continuar",
        vibrate = true
    },
    {
        coords = vector3(33.53, -1348.26, 21.83),
        heading = 59.94,
        image = "talk2.png",
        text = "Las tiendas 24/7 son testigos mudos de todo. Compras comida, compras herramientas, compras excusas. De noche, los pasillos escuchan mas secretos que cualquier confesionario.",
        button = "Continuar",
        vibrate = false
    },
    {
        coords = vector3(119.97, -1285.13, 20.29),
        heading = 109.93,
        image = "marry.png",
        text = "El lujo, la musica y las luces solo son distraccion. Lo que realmente se mueve aqui es informacion, poder y contactos. Aprende rapido: en Capi Netta RP, todo tiene precio... incluso el silencio.",
        button = "Entrar a la ciudad",
        vibrate = false
    },
}

Config.Commands = { -- Comand list
    StartTutorial = 'tutorial',
    ResetTutorial = 'resettutorial'
}

Config.Hud = { -- Hud configuration
    Enable = function()
        -- DisplayRadar(true) -- Enables radar display on HUD
        -- exports['qs-interface']:ToggleHud(true) -- Uncomment if using an external HUD
    end,
    Disable = function()
        -- DisplayRadar(false) -- Disables radar display on HUD
        -- exports['qs-interface']:ToggleHud(false) -- Uncomment if using an external HUD
    end
}

Config.Debug = false -- Debug Configuration, enables detailed print logs for debugging; leave off for production