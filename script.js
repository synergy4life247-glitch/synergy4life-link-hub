document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.hub-button');

  buttons.forEach((button) => {
    button.addEventListener('touchstart', () => {
      button.classList.add('is-tapping');
    }, { passive: true });

    button.addEventListener('touchend', () => {
      window.setTimeout(() => button.classList.remove('is-tapping'), 120);
    });
  });

  const dateInput = document.getElementById('booking-date');
  const durationInput = document.getElementById('booking-duration');
  const typeInput = document.getElementById('booking-type');
  const slotGrid = document.getElementById('slot-grid');
  const selectedSlotText = document.getElementById('selected-slot');
  const requestSlot = document.getElementById('request-slot');
  const calendarInvite = document.getElementById('calendar-invite');

  if (!dateInput || !durationInput || !typeInput || !slotGrid || !selectedSlotText || !requestSlot || !calendarInvite) {
    return;
  }

  const email = 'synergy4life247@gmail.com';
  const phone = '813-785-1739';

  const today = new Date();
  const isoToday = today.toISOString().split('T')[0];
  dateInput.min = isoToday;
  dateInput.value = isoToday;

  const pad = (number) => String(number).padStart(2, '0');

  const formatDisplayTime = (minutes) => {
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const suffix = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${pad(minute)} ${suffix}`;
  };

  const formatGoogleDate = (dateString, minutes) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return `${dateString.replaceAll('-', '')}T${pad(hour)}${pad(minute)}00`;
  };

  const setLinksDisabled = () => {
    requestSlot.href = '#calendar';
    calendarInvite.href = '#calendar';
    requestSlot.classList.add('disabled-link');
    calendarInvite.classList.add('disabled-link');
    requestSlot.setAttribute('aria-disabled', 'true');
    calendarInvite.setAttribute('aria-disabled', 'true');
  };

  const setLinksActive = (slotMinutes) => {
    const dateValue = dateInput.value;
    const duration = Number(durationInput.value);
    const callType = typeInput.value;
    const endMinutes = slotMinutes + duration;
    const startLabel = formatDisplayTime(slotMinutes);
    const endLabel = formatDisplayTime(endMinutes);
    const title = `Synergy4Life ${callType} with James`;
    const details = `Synergy4Life ${duration}-minute ${callType}. Requested through the Synergy4Life Link Hub. James contact: ${phone}. If Zoom is selected, James will send or confirm the Zoom link.`;
    const location = callType === 'Zoom call' ? 'Zoom link to be confirmed' : `Phone call: ${phone}`;
    const body = `Hey James, I want to book this ${duration}-minute ${callType}.\n\nDate: ${dateValue}\nTime: ${startLabel} - ${endLabel} Eastern\nPhone: ${phone}\n\nName:\nMy phone/email:\nWhat I need help with:`;
    const googleDates = `${formatGoogleDate(dateValue, slotMinutes)}/${formatGoogleDate(dateValue, endMinutes)}`;
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${googleDates}&ctz=America/New_York&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&add=${encodeURIComponent(email)}`;

    selectedSlotText.textContent = `Selected: ${dateValue} • ${startLabel} - ${endLabel} Eastern • ${callType}`;
    requestSlot.href = `mailto:${email}?subject=${encodeURIComponent('Book Calendar Call with James')}&body=${encodeURIComponent(body)}`;
    calendarInvite.href = googleUrl;
    requestSlot.classList.remove('disabled-link');
    calendarInvite.classList.remove('disabled-link');
    requestSlot.setAttribute('aria-disabled', 'false');
    calendarInvite.setAttribute('aria-disabled', 'false');
  };

  const renderSlots = () => {
    const duration = Number(durationInput.value);
    const startMinutes = 9 * 60;
    const finalEndMinutes = 19 * 60;
    slotGrid.innerHTML = '';
    setLinksDisabled();
    selectedSlotText.textContent = 'Select a slot to request a call.';

    for (let minutes = startMinutes; minutes + duration <= finalEndMinutes; minutes += duration) {
      const slotButton = document.createElement('button');
      slotButton.type = 'button';
      slotButton.className = 'slot-button';
      slotButton.textContent = formatDisplayTime(minutes);
      slotButton.addEventListener('click', () => {
        document.querySelectorAll('.slot-button').forEach((button) => button.classList.remove('selected'));
        slotButton.classList.add('selected');
        setLinksActive(minutes);
      });
      slotGrid.appendChild(slotButton);
    }
  };

  dateInput.addEventListener('change', renderSlots);
  durationInput.addEventListener('change', renderSlots);
  typeInput.addEventListener('change', () => {
    const selected = document.querySelector('.slot-button.selected');
    if (selected) {
      const slotIndex = Array.from(slotGrid.children).indexOf(selected);
      const minutes = 9 * 60 + slotIndex * Number(durationInput.value);
      setLinksActive(minutes);
    }
  });

  renderSlots();
});
