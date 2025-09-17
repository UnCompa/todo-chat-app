export function catchErrors(fn: (req: any, res: any, next: any) => Promise<any>) {
  return function (req: any, res: any, next: any) {
    console.info('Middleware executed');
    fn(req, res, next).catch(next);
  };
}
