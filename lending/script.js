(function () {
  const PRICE_SINGLE = 363;
  const PRICE_WHOLESALE = 340;
  const PRICE_OLD = 669;

  const form = document.getElementById('order-form');
  const visibleName = document.getElementById('display-name');
  const visiblePhone = document.getElementById('display-phone');
  const hiddenName = document.getElementById('hidden-name');
  const hiddenPhone = document.getElementById('hidden-phone');
  const hiddenQty = document.getElementById('hidden-qty');
  const hiddenPrice = document.getElementById('hidden-price');

  const orderOldPrice = document.getElementById('orderOldPrice');
  const orderNewPrice = document.getElementById('orderNewPrice');
  const orderDiscountBadge = document.getElementById('orderDiscountBadge');
  const orderWholesaleNotice = document.getElementById('orderWholesaleNotice');
  const submitOrderBtn = document.getElementById('submitOrderBtn');

  let selectedQty = 1;

  function updateQtyPricing(qty) {
    selectedQty = qty;
    const unitPrice = qty >= 2 ? PRICE_WHOLESALE : PRICE_SINGLE;
    const totalNew = unitPrice * qty;
    const totalOld = PRICE_OLD * qty;

    document.querySelectorAll('.qty-pill').forEach(pill => {
      pill.classList.toggle('active', Number(pill.dataset.qty) === qty);
    });

    if (orderOldPrice) orderOldPrice.textContent = `${totalOld.toLocaleString('uk-UA')} ₴`;
    if (orderNewPrice) orderNewPrice.textContent = `${totalNew.toLocaleString('uk-UA')} ₴`;
    if (orderDiscountBadge) {
      orderDiscountBadge.textContent = qty >= 2
        ? `Спецціна: ${qty} шт × ${unitPrice} ₴ (−49%)`
        : `−46% • Акційна ціна за 1 шт`;
    }
    if (orderWholesaleNotice) {
      orderWholesaleNotice.innerHTML = qty >= 2
        ? `✅ Активовано спецціну <strong>340 ₴/шт</strong> (загальна довжина: <strong>${qty * 6} м</strong>)`
        : `При замовленні <strong>від 2 шт</strong> ціна знижується до <strong>340 ₴/шт</strong>!`;
    }
    if (submitOrderBtn) {
      submitOrderBtn.textContent = `Зробити замовлення • ${totalNew.toLocaleString('uk-UA')} ₴`;
    }
    if (hiddenQty) hiddenQty.value = String(qty);
    if (hiddenPrice) hiddenPrice.value = String(totalNew);
  }

  document.querySelectorAll('.qty-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      updateQtyPricing(Number(pill.dataset.qty) || 1);
    });
  });

  function syncOrderFields() {
    if (hiddenName && visibleName) hiddenName.value = visibleName.value.trim();
    if (hiddenPhone && visiblePhone) hiddenPhone.value = visiblePhone.value.trim();
  }

  if (visibleName) visibleName.addEventListener('input', syncOrderFields);
  if (visiblePhone) visiblePhone.addEventListener('input', syncOrderFields);

  if (form) {
    form.addEventListener('submit', function (event) {
      syncOrderFields();
      // Якщо сторінка відкрита локально (file://), показуємо вікно підтвердження замовлення
      if (window.location.protocol === 'file:' || !form.getAttribute('action')) {
        event.preventDefault();
        const successDialog = document.getElementById('order-success');
        const successBody = document.getElementById('order-success-body');
        const unitPrice = selectedQty >= 2 ? PRICE_WHOLESALE : PRICE_SINGLE;
        const total = unitPrice * selectedQty;
        if (successBody) {
          successBody.innerHTML = `
            <p><strong>Дякуємо, ${hiddenName.value || 'Покупець'}!</strong></p>
            <p>Ваше замовлення на <strong>Гірлянду Бахрома 105 LED 6 м (6МBY)</strong> прийнято:</p>
            <p>• Кількість: <strong>${selectedQty} шт (${selectedQty * 6} м)</strong><br>
               • Сума до сплати: <strong>${total} ₴</strong><br>
               • Телефон: <strong>${hiddenPhone.value}</strong></p>
            <p>Менеджер зателефонує вам найближчим часом для уточнення відділення доставки.</p>
          `;
        }
        if (successDialog && typeof successDialog.showModal === 'function') {
          successDialog.showModal();
        }
        form.reset();
        updateQtyPricing(1);
      }
    });
  }

  // Логіка діалогових вікон (1-в-1 як у референсі)
  document.querySelectorAll('[data-dialog]').forEach(link => {
    link.addEventListener('click', event => {
      const dialog = document.getElementById(link.dataset.dialog);
      if (dialog && typeof dialog.showModal === 'function') {
        event.preventDefault();
        dialog.showModal();
      }
    });
  });

  document.querySelectorAll('.dialog-close').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      const outside =
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom;
      if (outside) dialog.close();
    });
  });
})();
