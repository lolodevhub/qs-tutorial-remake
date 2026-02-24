fx_version 'cerulean'
game 'gta5'

version '1.0.11'

lua54 'yes'

shared_script {
    'shared/**'
}

server_script 'server/main.lua'

client_script 'client/main.lua'

ui_page 'html/index.html'

files {
    'html/**/**',
}

escrow_ignore {
    'shared/config.lua',
}

dependency '/assetpacks'