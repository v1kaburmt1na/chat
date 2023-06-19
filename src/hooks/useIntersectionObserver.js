import { useEffect, useState } from "react";

export const useIntersectionObserver = (
  elementRef,
  { threshold = 0, root = null, rootMargin = "0%", freezeOnceVisible = false }
) => {
  const [entry, setEntry] = useState(); // сам элемент, за которым следим
  const frozen = entry?.isIntersecting && freezeOnceVisible; // переменная, которая говорит о том следить ли за элементом после 1 вхождения в область видимости
  const updateEntry = ([entry]) => { // функция, которая выполнится когда элемент попадет в область видимости
    setEntry(entry); // изменяем элемент, за которым следим
  };

  useEffect(() => {
    const node = elementRef?.current; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;
    if (!hasIOSupport || frozen || !node) return;
    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);
    observer.observe(node); // подписка на слежку за элементом
    return () => observer.disconnect(); // отписка при удалении компонента из DOM
  }, [
    elementRef?.current,
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
  ]);

  return entry;
}
