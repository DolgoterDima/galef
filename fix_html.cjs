const fs = require('fs');
let html = fs.readFileSync('src/pages/product.html', 'utf8');

const startStr = '<div class="product-specifications">';
const endStr = '<!-- Section: Reviews -->';

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = `              <div class="product-specifications">
                <div class="product-specifications__left">
                  <h2 class="product-specifications__title">Характеристики</h2>
                  <button class="product-specifications__btn">
                    <span>Читать опис повністю</span>
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-180deg);">
                      <path d="M12 6L8 10L4 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div class="product-specifications__table">
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Матеріал оббивки</span>
                    <div class="product-specifications__value">Текстиль</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Максимальне навантаження</span>
                    <div class="product-specifications__value">120 кг</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Максимальний зріст</span>
                    <div class="product-specifications__value">180 см</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Особливості</span>
                    <div class="product-specifications__value">
                      <span class="product-specifications__item product-specifications__item--blue">Бічна підтримка спини</span>
                      <span class="product-specifications__item product-specifications__item--blue">Поперекова підтримка</span>
                      <span class="product-specifications__item product-specifications__item--blue">Посилена основа</span>
                      <span class="product-specifications__item product-specifications__item--blue">Прогумовані ролики</span>
                      <span class="product-specifications__item product-specifications__item--blue">Підголівники</span>
                    </div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Колір</span>
                    <div class="product-specifications__value">Сірий</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Механізм</span>
                    <div class="product-specifications__value">Tilt</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Ступінь жорсткості</span>
                    <div class="product-specifications__value">Середній</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Регулювання</span>
                    <div class="product-specifications__value">
                      <span class="product-specifications__item product-specifications__item--blue">Висота підлокітників</span>
                      <span class="product-specifications__item product-specifications__item--blue">Висота сидіння</span>
                      <span class="product-specifications__item product-specifications__item--blue">Кут нахилу сидіння</span>
                      <span class="product-specifications__item product-specifications__item--blue">Кут нахилу спинки</span>
                    </div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Основа</span>
                    <div class="product-specifications__value">Коліщатка з прогумованим покриттям (безпечні для паркету)</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Розміри спинки (ШхВ)</span>
                    <div class="product-specifications__value">52 х 85 см</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Вага крісла</span>
                    <div class="product-specifications__value">18.5 кг</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Механізм гойдання</span>
                    <div class="product-specifications__value">Anyfix (з можливістю фіксації в будь-якому положенні)</div>
                  </div>
                  <div class="product-specifications__row">
                    <span class="product-specifications__label">Гарантія</span>
                    <div class="product-specifications__value">12 місяців</div>
                  </div>
                </div>
              </div>
            </div>

            `;
  
  html = html.substring(0, startIndex) + newContent + html.substring(endIndex);
  fs.writeFileSync('src/pages/product.html', html, 'utf8');
  console.log("Replaced successfully.");
} else {
  console.log("Could not find start or end index.");
}
