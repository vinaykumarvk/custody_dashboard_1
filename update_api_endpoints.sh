#!/bin/bash

# Update all API endpoints to use index.json
sed -i 's|api/trades"|api/trades/index.json"|g' js/services/dataService.js
sed -i 's|api/income"|api/income/index.json"|g' js/services/dataService.js
sed -i 's|api/events"|api/events/index.json"|g' js/services/dataService.js
sed -i 's|api/deals"|api/deals/index.json"|g' js/services/dataService.js
sed -i 's|api/corporate-actions"|api/corporate-actions/index.json"|g' js/services/dataService.js

