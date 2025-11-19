const eventListeners = new Map();

// root요소에 이벤트 리스너를 등록
export function setupEventListeners(root) {
  // eventType 가져오기, 중복된 이벤트 타입은 제거
  const eventTypes = new Set();
  eventListeners.forEach((listeners) => {
    listeners.forEach(({ eventType }) => {
      eventTypes.add(eventType);
    });
  });

  // eventType 마다 이벤트 리스너 등록
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      const $target = event.target;
      eventListeners.forEach((listeners, element) => {
        if ($target === element) {
          listeners
            .filter((listener) => listener.eventType === eventType)
            .forEach((listener) => listener.handler(event));
        }
      });
    });
  });
}

export function addEvent(element, eventType, handler) {
  // element가 dom 요소를 가져옴
  // 전역변수를 만들어서 이벤트 타입을 저장 왜 배열이 아닌 맵으로? 배열은 순서가 있어서 중복된 이벤트 타입을 처리할 수 없음

  // map에 element 가 있는지 확인
  // 있으면 기존 배열에 추가
  // 없으면 새 배열 만들고 추가
  if (eventListeners.has(element)) {
    eventListeners.get(element).push({
      eventType: eventType,
      handler: handler,
    });
  } else {
    eventListeners.set(element, [
      {
        eventType,
        handler,
      },
    ]);
  }
}

export function removeEvent(element, eventType, handler) {
  // 등록 이벤트 핸들러가 있는지 확인
  const listeners = eventListeners.get(element);
  if (listeners) {
    console.log("removeEvent", listeners);
    const filteredListeners = listeners.filter(
      ({ eventType: type, handler: fn }) => type != eventType && fn != handler,
    );

    console.log("filteredListeners", filteredListeners);

    if (filteredListeners.length === 0) {
      eventListeners.delete(element);
    } else {
      eventListeners.set(element, filteredListeners);
    }
  }
}
