const SECOND = 1000;

const parseDuration = (value) => {
  if (!value) {
    return null;
  }

  const parts = value.trim().split(':').map(Number);

  if (parts.some(Number.isNaN)) {
    return null;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return null;
};

const getDurationFromUnits = (timer) => {
  const units = Array.from(timer.querySelectorAll('.sale-detail__time-unit'));

  if (units.length < 3) {
    return null;
  }

  const [hours, minutes, seconds] = units.map(unit => Number(unit.textContent.trim()));

  if ([hours, minutes, seconds].some(Number.isNaN)) {
    return null;
  }

  return hours * 3600 + minutes * 60 + seconds;
};

const getTargetTime = (timer) => {
  const endTime = Date.parse(timer.dataset.countdownEnd || '');

  if (!Number.isNaN(endTime)) {
    return endTime;
  }

  const duration = parseDuration(timer.dataset.countdownDuration) ?? getDurationFromUnits(timer);

  if (duration === null) {
    return null;
  }

  return Date.now() + duration * SECOND;
};

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map(value => String(value).padStart(2, '0'));
};

const renderTimer = (timer, totalSeconds) => {
  const units = Array.from(timer.querySelectorAll('.sale-detail__time-unit'));
  const values = formatTime(totalSeconds);

  units.slice(0, 3).forEach((unit, index) => {
    unit.textContent = values[index];
  });

  timer.setAttribute('aria-label', values.join(':'));
};

const initTimer = (timer) => {
  if (timer.dataset.countdownInitialized === 'true') {
    return;
  }

  const targetTime = getTargetTime(timer);

  if (targetTime === null) {
    return;
  }

  timer.dataset.countdownInitialized = 'true';

  const tick = () => {
    const remainingSeconds = Math.max(0, Math.ceil((targetTime - Date.now()) / SECOND));
    renderTimer(timer, remainingSeconds);

    if (remainingSeconds === 0) {
      window.clearInterval(intervalId);
    }
  };

  const intervalId = window.setInterval(tick, SECOND);
  tick();
};

export const initCountdowns = () => {
  document.querySelectorAll('.sale-detail__time').forEach(initTimer);
};
