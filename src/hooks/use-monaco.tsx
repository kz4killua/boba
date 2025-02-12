import { useState } from 'react';
import loader from '@monaco-editor/loader';
import { useEffect, type EffectCallback } from 'react';

export function useMonaco() {
  const [monaco, setMonaco] = useState(loader.__getMonacoInstance());

  useMount(() => {
    let cancelable: ReturnType<typeof loader.init>;

    if (!monaco) {
      cancelable = loader.init();

      cancelable.then((monaco) => {
        setMonaco(monaco);
      })
      
      // Fixes https://github.com/suren-atoyan/monaco-react/issues/440
      .catch((error) => {
        if (error.type !== 'cancelation') {
          console.error(error);
        }
      });
    }

    return () => cancelable?.cancel();
  });

  return monaco;
}

function useMount(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}
