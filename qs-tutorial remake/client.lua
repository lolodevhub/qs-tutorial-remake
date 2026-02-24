RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    Wait(2000) -- importante para que termine de cargar todo
    TriggerEvent('qs-tutorial:startTutorial')
end)
