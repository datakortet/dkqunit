
import sys, os
SRV = os.environ['SRV']
sys.path.insert(0, os.path.join(SRV, 'bin'))

from invoke import task, run
from changed import changed


@task
def mktest():
    """Create testsuite.
    """
    if changed('tests'):
        os.chdir('tests')
        run("python ../dktest/mktest.py")
