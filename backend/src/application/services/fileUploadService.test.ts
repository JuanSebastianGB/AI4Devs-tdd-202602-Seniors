const uploaderHandler = jest.fn();

jest.mock('multer', () => {
  const actual = jest.requireActual('multer') as typeof import('multer');
  const diskStorage = jest.fn(() => ({}));
  const factory = jest.fn(() => ({
    single: jest.fn(() => uploaderHandler),
  }));
  return Object.assign(factory, { diskStorage, MulterError: actual.MulterError });
});

import multer from 'multer';
import {
  uploadDiskDestination,
  uploadDiskFilename,
  uploadFile,
  uploadFileFilter,
} from './fileUploadService';

describe('upload disk + filter helpers', () => {
  it('resolves the upload directory', () => {
    const cb = jest.fn();
    uploadDiskDestination({} as any, { originalname: 'a.pdf' } as any, cb);
    expect(cb).toHaveBeenCalledWith(null, '../uploads/');
  });

  it('builds a unique filename', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(123 as unknown as number);
    const cb = jest.fn();
    uploadDiskFilename({} as any, { originalname: 'cv.pdf' } as any, cb);
    expect(cb).toHaveBeenCalledWith(null, '123-cv.pdf');
    nowSpy.mockRestore();
  });

  it('accepts PDF uploads', () => {
    const cb = jest.fn();
    uploadFileFilter({} as any, { mimetype: 'application/pdf' } as any, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('accepts DOCX uploads', () => {
    const cb = jest.fn();
    uploadFileFilter(
      {} as any,
      { mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' } as any,
      cb,
    );
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('rejects unsupported mime types', () => {
    const cb = jest.fn();
    uploadFileFilter({} as any, { mimetype: 'image/png' } as any, cb);
    expect(cb).toHaveBeenCalledWith(null, false);
  });
});

describe('uploadFile', () => {
  let json: jest.Mock;
  let res: { status: jest.Mock };

  beforeEach(() => {
    json = jest.fn();
    res = {
      status: jest.fn().mockReturnValue({ json }),
    };
    uploaderHandler.mockReset();
  });

  it('returns 400 when no file is stored on the request', () => {
    uploaderHandler.mockImplementation((_req: any, _res: any, cb: any) => cb(null));
    const req: any = {};
    uploadFile(req, res as any);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: 'Invalid file type, only PDF and DOCX are allowed!',
    });
  });

  it('returns file metadata when upload succeeds', () => {
    uploaderHandler.mockImplementation((_req: any, _res: any, cb: any) => cb(null));
    const req: any = { file: { path: '/tmp/x.pdf', mimetype: 'application/pdf' } };
    uploadFile(req, res as any);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      filePath: '/tmp/x.pdf',
      fileType: 'application/pdf',
    });
  });

  it('returns 500 for multer-specific errors', () => {
    const err = new (multer as any).MulterError('too big', 'LIMIT_FILE_SIZE');
    uploaderHandler.mockImplementation((_req: any, _res: any, cb: any) => cb(err));
    uploadFile({} as any, res as any);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: err.message });
  });

  it('returns 500 for generic upload errors', () => {
    uploaderHandler.mockImplementation((_req: any, _res: any, cb: any) => cb(new Error('disk')));
    uploadFile({} as any, res as any);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'disk' });
  });
});
