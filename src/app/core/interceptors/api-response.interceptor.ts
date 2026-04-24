import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

function mapIds(data: unknown): unknown {
  if (Array.isArray(data)) return data.map(mapIds);
  if (data !== null && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      result[key === '_id' ? 'id' : key] = mapIds(obj[key]);
    }
    return result;
  }
  return data;
}

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const body = event.body as Record<string, unknown> | null;
        if (body && typeof body === 'object' && 'success' in body) {
          const unwrapped = body['data'] !== undefined ? body['data'] : body;
          return event.clone({ body: mapIds(unwrapped) });
        }
      }
      return event;
    })
  );
};
